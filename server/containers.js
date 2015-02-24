var exec     = require('child_process').exec;
var Express  = require('express');
var Fs       = require('fs');
var _        = require('underscore');

var config    = require('./config');
var Container = require('./container');
var nginx     = require('./nginx');

if (config.api.docker) {
    var docker = require('./docker');
} else {
    var docker = require('./mock-docker');
}

var containers;

containers = new Express();

containers.delete('/container/:name', function (req, res) {
    Container.remove({name : req.params.name}).exec()
        .then(
            function () {
                req.io.emit('container-killed');
                res.sendStatus(204);
            }
        );
});

containers.get('/container/:name', function (req, res) {
    Container.find({name : req.params.name}).exec()
        .then(
            function (containers) {
                if (containers.length) {
                    res.send(containers[0]);
                } else {
                    res.sendStatus(404);
                }
            }
        );
});

containers.get('/containers', function (req, res) {
    Container.find({}).exec()
        .then(
            function (containers) {
                res.send(containers);
            }
        );
});

containers.post('/container', function (req, res) {
    Container.find({name : req.body.name}).exec()
        .then(
            function (containers) {
                if (containers.length || ['api'].indexOf(req.body.name) !== -1) {
                    res.status(422);
                    res.send({message : 'Container `' + req.body.name + '` already exists'});
                } else {
                    docker.create(req.body.name).then(
                        function (response) {
                            var data = {
                                builds : [],
                                host   : response.Hostname,
                                id     : response.Id,
                                image  : response.Image,
                                name   : req.body.name
                            };

                            docker.inspect(data.name).then(
                                function (response) {
                                    var container;

                                    data.ports = {
                                        22 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 22}).PublicPort,
                                        80 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 80}).PublicPort
                                    };

                                    data.state = response.state;

                                    container = new Container(data);

                                    container.save(
                                        function () {
                                            Fs.mkdir('containers/' + req.body.name, function (err) {
                                                if (err && err.code !== 'EEXIST') throw err;

                                                if (! err) {
                                                    Fs.mkdir('containers/' + req.body.name + '/builds');
                                                    Fs.mkdir('containers/' + req.body.name + '/working');
                                                }

                                                req.io.emit('container:created');
                                                res.send(data);
                                            });
                                        }
                                    );
                                },
                                function (error) {
                                    res.status(500);
                                    res.send(error);
                                }
                            )
                            .done();
                       },
                        function (error) {
                            res.status(500);
                            res.send(error);
                        }
                    )
                    .done();
                }
            }
        );
});

// Capture any uploaded file in a buffer
containers.use('/container/:name/build', function (req, res, next) {
    var data = new Buffer('');

    req.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
    });

    req.on('end', function  () {
        req.rawBody = data;
        next();
    });
});

containers.post('/container/:name/build', function (req, res) {
    Container.find({name : req.params.name}).exec()
        .then(
            function (containers) {
                if (containers.length) {
                    if (! _.findWhere(containers[0].builds, {name : req.query.name})) {
                        var path = 'containers/' + containers[0].name + '/builds/' + req.query.name;

                        Fs.writeFile(
                            path,
                            req.rawBody,
                            function (err) {
                                if (err) throw err;
                                exec(
                                    'rm -rf containers/' + containers[0].name + '/working && unzip containers/' + containers[0].name + '/builds/' + req.query.name + ' -d containers/' + containers[0].name + '/working',
                                    function (error, stdout, stderr) {
                                        containers[0].builds.push({name : req.query.name, path : path});
                                        containers[0].save(function () {
                                            res.sendStatus(204);
                                        });
                                    }
                                );
                            }
                        );
                    } else {
                        res.status(422);
                        res.send({message : 'Build `' + req.query.name + '` already exists'});
                    }
                } else {
                    res.sendStatus(404);
                }
            }
        );
});

containers.put('/container/:name', function (req, res) {
    res.sendStatus(501);
});

module.exports = containers;

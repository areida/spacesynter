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

function changeWorkingBuild(container, build, callback) {
    exec(
        'rm -rf __containers__/' + container + '/working && unzip __containers__/' + container + '/builds/' + build + ' -d __containers__/' + container + '/working',
        callback
    );
}

containers = new Express();

containers.delete('/container/:name', function (req, res) {
    Container.find({name : req.params.name}).exec()
        .then(
            function (containers) {
                if (containers.length) {
                    var container = containers[0];

                    docker.kill(container.id).then(
                        function () {
                            exec('rm -rf __containers__/' + container.name, function () {
                                Container.remove({name : container.name})
                                    .exec()
                                    .then(
                                        function () {
                                            nginx.reload().then(
                                                function () {
                                                    req.io.emit('container-killed');
                                                    res.sendStatus(204);
                                                }
                                            );
                                        }
                                    );
                            });
                        },
                        function () {
                            res.sendStatus(500);
                        }
                    );
                } else {
                    res.sendStatus(404);
                }
            }
        );
});

containers.get('/container/:name', function (req, res) {
    Container.find({name : req.params.name}).exec()
        .then(
            function (containers) {
                if (containers.length) {
                    res.send(containers[0].toObject());
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

containers.patch('/container/:name', function (req, res) {
    Container.find({name : req.params.name})
        .exec()
        .then(
            function (containers) {
                if (containers.length && req.body.build) {
                    var container = containers[0];

                    changeWorkingBuild(
                        container.name,
                        build,
                        function (error, stdout, stderr) {
                            container.activeBuild = build;
                            container.save(
                                function () {
                                    res.send(containers[0].toObject());
                                }
                            );
                        }
                    );
                } else {
                    res.sendStatus(404);
                }
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
                            var container = new Container({
                                builds : [],
                                host   : response.Hostname,
                                id     : response.Id,
                                image  : response.Image,
                                name   : req.body.name
                            });

                            docker.inspect(req.body.name).then(
                                function (response) {
                                    container.ports = {
                                        22 : parseInt(_.findWhere(response.HostConfig.Ports, {PrivatePort : 22}).PublicPort, 10),
                                        80 : parseInt(_.findWhere(response.HostConfig.Ports, {PrivatePort : 80}).PublicPort, 10)
                                    };

                                    container.save(
                                        function () {
                                            Fs.mkdir('__containers__/' + req.body.name, function (err) {
                                                if (err && err.code !== 'EEXIST') throw err;

                                                if (! err) {
                                                    Fs.mkdir('__containers__/' + req.body.name + '/builds');
                                                    Fs.mkdir('__containers__/' + req.body.name + '/working');
                                                }

                                                nginx.reload().then(
                                                    function () {
                                                        req.io.emit('container:created');
                                                        res.send(container.toObject());
                                                    }
                                                );
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

    req.on('end', function () {
        req.rawBody = data;
        next();
    });
});

containers.post('/container/:name/build', function (req, res) {
    Container.find({name : req.params.name}).exec()
        .then(
            function (containers) {
                if (containers.length) {
                    var container = containers[0];

                    if (! _.findWhere(container.builds, {name : req.query.name})) {
                        var path = '__containers__/' + container.name + '/builds/' + req.query.name;

                        Fs.writeFile(
                            path,
                            req.rawBody,
                            function (err) {
                                if (err) throw err;
                                changeWorkingBuild(
                                    container.name,
                                    req.query.name,
                                    function (error, stdout, stderr) {
                                        container.builds.push({name : req.query.name, path : path});
                                        container.activeBuild = req.query.name;
                                        container.save(
                                            function () {
                                                res.send(container.toObject());
                                            }
                                        );
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

module.exports = containers;

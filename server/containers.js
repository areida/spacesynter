var Express = require('express');
var Fs      = require('fs');
var Redis   = require('then-redis');
var _       = require('underscore');

var config = require('./config');
var nginx  = require('./nginx');

if (config.api.docker) {
    var docker = require('./docker');
} else {
    var docker = require('./mock-docker');
}

var buildClient, containerClient, containers;

buildClient     = Redis.createClient(config.redis.builds);
containerClient = Redis.createClient(config.redis.containers);
containers      = new Express();

containers.disable('etag');

// Capture any uploaded file in a buffer
containers.use(function(req, res, next) {
    var data = new Buffer('');

    req.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
    });

    req.on('end', function  () {
        req.rawBody = data;
        next();
    });
});

containers.delete('/container/:name', function(req, res) {
    containerClient.get(req.params.name).then(function (container) {
        if (container) {
            docker.kill(container.id).then(
                function () {
                    containerClient.del(req.params.name).then(function () {
                        containerClient.publish('container', 'killed');
                        res.sendStatus(204);
                    })
                    .done();
                },
                function (error) {
                    res.status(500);
                    res.send(error);
                }
            )
            .done();
        } else {
            res.sendStatus(404);
        }
    })
    .done();
});

containers.get('/container/:name', function(req, res) {
    containerClient.get(req.params.name).then(function (container) {
        if (container) {
            res.send(container);
        } else {
            res.sendStatus(404);
        }
    })
    .done();
});

containers.get('/containers', function(req, res) {
    containerClient.keys('*').then(function (keys) {
        if (keys.length) {
            containerClient.mget(keys).then(function (containers) {
                res.send(containers.map(function (container) { return JSON.parse(container); }));
            })
            .done();
        } else {
            res.json([]);
        }
    })
    .done();
});

containers.post('/container', function(req, res) {
    containerClient.exists(req.body.name).then(function (exists) {
        if (exists || ['api'].indexOf(req.body.name) !== -1) {
            res.status(422);
            res.send({message : 'Container `' + req.body.name + '` already exists'});
        } else {
            docker.create(req.body.name).then(
                function (response) {
                    var data = {
                        id    : response.Id,
                        image : response.Image,
                        name  : req.body.name,
                        host  : response.Hostname
                    };

                    docker.inspect(data.name).then(
                        function (response) {
                            data.ports = {
                                22 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 22}).PublicPort,
                                80 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 80}).PublicPort
                            };

                            data.state = response.state;

                            containerClient.set(data.name, JSON.stringify(data));
                            containerClient.publish('container', 'created');
                            res.send(data);
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
    })
    .done();
});

containers.post('/container/:name/build', function (req, res) {
    containerClient.get(req.params.name).then(
        function (container) {
            var buildName;

            if (container) {
                container = JSON.parse(container);
                buildName = conainer.name + '--' + req.query.name;

                buildClient.exists(buildName).then(
                    function (exists) {
                        if (! exists) {

                            Fs.writeFile(
                                'containers/' + container.name + '/builds/' + req.query.name,
                                req.rawBody,
                                function (err) {
                                    if (err) throw err;
                                    buildClient.set(buildName, JSON.stringify({
                                        container : container.name,
                                        filename  : req.query.name
                                    }));
                                    res.sendStatus(204);
                                }
                            );
                        } else {
                            res.status(422);
                            res.send({message : 'Build `' + req.query.name + '` already exists'});
                        }
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

containers.put('/container/:name', function(req, res) {
    res.sendStatus(501);
    /*containerClient.exists(req.params.name).then(function (exists) {
        if (exists) {
            containerClient.set(req.params.name, req.body);
            containerClient.publish('container', 'updated');
            res.send(req.body);
        } else {
            res.sendStatus(404);
        }

        res.end();
    })
    .done();*/
});

module.exports = containers;

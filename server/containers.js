var Express = require('express');
var Redis   = require('then-redis');
var _       = require('underscore');

var config = require('../application/config');
var nginx  = require('./nginx');

if (config.api.docker) {
    var docker = require('./docker');
} else {
    var docker = require('./mock-docker');
}

var containers, illegalContainerNames, redisClient;

containers   = new Express();
illegalNames = ['api'];
redisClient  = Redis.createClient(config.redis.containers);

containers.disable('etag');

containers.delete('/container/:name', function(req, res) {
    redisClient.get(req.params.name).then(function (container) {
        if (container) {
            docker.kill(container.id).then(
                function () {
                    redisClient.del(req.params.name).then(function () {
                        redisClient.publish('container', 'killed');
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
    redisClient.get(req.params.name).then(function (container) {
        if (container) {
            res.send(container);
        } else {
            res.sendStatus(404);
        }
    })
    .done();
});

containers.get('/containers', function(req, res) {
    redisClient.keys('*').then(function (keys) {
        if (keys.length) {
            redisClient.mget(keys).then(function (containers) {
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
    redisClient.exists(req.body.name).then(function (exists) {
        if (exists || illegalNames.indexOf(req.body.name) !== -1) {
            res.status(422);
            res.send({message : '`' + req.body.name + '` already exists'});
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

                            redisClient.set(data.name, JSON.stringify(data));
                            redisClient.publish('container', 'created');
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

containers.put('/container/:name', function(req, res) {
    res.sendStatus(501);
    /*redisClient.exists(req.params.name).then(function (exists) {
        if (exists) {
            redisClient.set(req.params.name, req.body);
            redisClient.publish('container', 'updated');
            res.send(req.body);
        } else {
            res.sendStatus(404);
        }

        res.end();
    })
    .done();*/
});

module.exports = containers;

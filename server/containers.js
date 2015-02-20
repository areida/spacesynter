var Express = require('express');
var Redis   = require('then-redis');

var config = require('../application/config');
var docker = require('./docker');
var nginx  = require('./nginx');

var containers, illegalContainerNames, redisClient;

containers   = new Express();
illegalNames = ['api'];
redisClient  = Redis.createClient(config.redis.containers);

containers.disable('etag');

containers.delete('/container/:name', function(req, res) {
    redisClient.get(req.params.name).then(function (container) {
        if (container) {
            docker.kill(container.name).then(function () {
                    redisClient.hdel(req.params.name);
                    redisClient.publish('container', 'removed');
                    res.sendStatus(204);
               },
                function (error) {
                    res.sendStatus(500);
                    res.send(error);
                }
            );
        } else {
            res.sendStatus(404);
        }
    });
});

containers.get('/container/:name', function(req, res) {
    redisClient.exists(req.params.name).then(function (exists) {
        if (exists) {
            redisClient.get(req.params.name).then(function (containers) {
                res.send(containers);
            });
        } else {
            res.sendStatus(404);
        }
    });
});

containers.get('/containers', function(req, res) {
    redisClient.keys('*').then(function (keys) {
        if (keys) {
            redisClient.mget(keys).then(function (containers) {
                res.send(containers);
            });
        } else {
            res.json([]);
        }
    });
});

containers.post('/container', function(req, res) {
    redisClient.exists(req.body.name).then(function (exists) {
        if (exists || illegalNames.indexOf(req.body.name) !== -1) {
            res.status(422);
            res.send({message : '`' + req.body.name + '` already exists'});
        } else {
            docker.create(req.body.name).then(
                function (response, options) {
                    var data = {
                        id   : response.Id,
                        name : req.body.name,
                        host : options.Hostname
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
                            res.json(data);
                        },
                        function (error) {
                            res.sendStatus(500);
                        }
                    );
               },
                function (error) {
                    res.sendStatus(500);
                }
            );
        }
    });
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
    });*/
});

module.exports = containers;
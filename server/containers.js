var Express = require('express');

var config = require('../application/config');
var docker = require('./docker');
var nginx  = require('./nginx');

var containers, illegalContainerNames, redisClient;

containers   = new Express();
illegalNames = ['api'];
redisClient  = Redis.createClient(config.redis.containers);

containers.delete('/container/:id', function(req, res) {
    redisClient.hget(req.params.id).then(function (container) {
        if (container) {
            docker.kill(container.id).then(function () {
                    redisClient.hdel(req.params.id);
                    redisClient.publish('container', 'removed');
                    res.end();
               },
                function (error) {
                    res.sendStatus(500);
                    res.send(error);
                    res.end();
                }
            );
        } else {
            res.sendStatus(404);
        }

        res.end();
    });
});

containers.get('/container/:id', function(req, res) {
    redisClient.exists(req.params.id).then(function (exists) {
        if (exists) {
            redisClient.hget(req.params.id).then(function (item) {
                res.send(item);
                res.end();
            });
        } else {
            res.sendStatus(404);
            res.end();
        }
    });
});

containers.get('/containers', function(req, res) {
    redisClient.keys('*').then(function (keys) {
        if (keys) {
            redisClient.hgetall(keys).then(function (items) {
                res.send(items);
                res.end();
            });
        } else {
            res.send([]);
            res.end();
        }
    });
});

containers.post('/container', function(req, res) {
    redisClient.exists(req.body.name).then(function (exists) {
        if (exists || illegalNames.indexOf(req.body.name) !== -1) {
            res.send({message : '`' + req.body.name + '` already exists'});
            res.sendStatus(422);

            res.end();
        } else {
            docker.create(req.body.name).then(
                function (response, options) {
                    var data = {
                        id   : response.Id,
                        name : req.body.name,
                        host : options.Hostname
                    };

                    docker.inspect(data.id).then(
                        function (response) {
                            data.ports = {
                                22 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 22}).PublicPort,
                                80 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 80}).PublicPort
                            };

                            data.state = JSON.stringify(response.state);

                            redisClient.hmset(data.id, data);
                            redisClient.publish('container', 'created');
                            res.send(data);
                            res.end();
                        },
                        function (error) {
                            res.sendStatus(500);
                            res.send(error);
                            res.end();
                        }
                    );
               },
                function (error) {
                    res.sendStatus(500);
                    res.send(error);
                    res.end();
                }
            );
        }
    });
});

containers.put('/container/:id', function(req, res) {
    res.sendStatus(501);
    res.end();
    /*redisClient.exists(req.params.id).then(function (exists) {
        if (exists) {
            redisClient.hmset(req.params.id, req.body);
            redisClient.publish('container', 'updated');
            res.send(req.body);
        } else {
            res.sendStatus(404);
        }

        res.end();
    });*/
});

module.exports = containers;
var Express = require('express');
var Redis   = require('then-redis');

var config = require('../application/config');

var containers, illegalContainerNames, redisClient;

containers   = new Express();
illegalNames = ['api'];
redisClient  = Redis.createClient(config.redis.containers);

containers.delete('/container/:id', function(req, res) {
    redisClient.hget(req.params.id).then(function (container) {
        if (container) {
            redisClient.hdel(req.params.id);
            redisClient.publish('container', 'removed');
            res.end();
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
            var id = guid();
            var data = {
                id    : id,
                name  : req.body.name,
                host  : id + '.' + config.app.hostname + ':' + config.app.port,
                ports : {
                    22 : 45123,
                    80 : 42341
                },
                state : {}
            };

            redisClient.hmset(data.id, data);
            redisClient.publish('container', 'created');
            res.send(data);
            res.end();
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
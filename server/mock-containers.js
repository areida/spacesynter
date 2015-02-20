var Express = require('express');
var Redis   = require('then-redis');

var config = require('../application/config');

var containers, illegalContainerNames, redisClient;

containers   = new Express();
illegalNames = ['api'];
redisClient  = Redis.createClient(config.redis.containers);

containers.disable('etag');

containers.delete('/container/:name', function(req, res) {
    redisClient.get(req.params.name).then(function (container) {
        if (container) {
            redisClient.del(req.params.name).then(function () {
                redisClient.publish('container', 'removed');
                res.sendStatus(204);
            });
        } else {
            res.sendStatus(404);
        }
    });
});

containers.get('/container/:name', function(req, res) {
    redisClient.exists(req.params.name).then(function (exists) {
        if (exists) {
            redisClient.get(req.params.name).then(function (container) {
                res.send(container);
            });
        } else {
            res.sendStatus(404);
        }
    });
});

containers.get('/containers', function(req, res) {
    redisClient.keys('*').then(function (keys) {
        if (keys.length) {
            redisClient.mget(keys).then(function (containers) {
                res.json(containers.map(function (container) { return JSON.parse(container); }));
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
            var id   = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);;
            var data = {
                id    : id,
                name  : req.body.name,
                host  : req.body.name + '.' + (process.env.HOSTNAME || (config.app.hostname + ':' + config.app.port)),
                ports : {
                    22 : 45123,
                    80 : 42341
                },
                state : {}
            };

            redisClient.set(data.name, JSON.stringify(data));
            redisClient.publish('container', 'created');
            res.json(data);
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

var Express    = require('express');
var Redis      = require('then-redis');
var bodyParser = require('body-parser')
var _          = require('underscore');

var config = require('../application/config');
var docker = require('./docker');
var nginx  = require('./nginx');

var db, dbServer;

db = Redis.createClient(config.redis);

dbServer = new Express();

dbServer.use(bodyParser.json());

dbServer.delete('/db/instance/:key', function(req, res) {
    db.hget(req.params.key).then(function (instance) {
        if (instance) {
            docker.kill(instance.id).then(
                    db.hdel(req.params.key);
                    db.publish('container', 'removed');
                    nginx.reload();
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

dbServer.get('/db/instance/:key', function(req, res) {
    db.exists(req.params.key).then(function (exists) {
        if (exists) {
            db.hget(req.params.key).then(function (item) {
                res.send(item);
                res.end();
            });
        } else {
            res.sendStatus(404);
            res.end();
        }
    });
});

dbServer.get('/db/instances', function(req, res) {
    db.keys('*').then(function (keys) {
        if (keys.length) {
            db.hgetall(keys).then(function (items) {
                res.send(items);
                res.end();
            });
        } else {
            res.send([]);
            res.end();
        }
    });
});

dbServer.post('/db/instance', function(req, res) {
    db.exists(req.body.name).then(function (exists) {
        if (! exists) {
            docker.create(req.body.name).then(
                function (response, options) {
                    var data = {,
                        id   : response.Id,
                        name : req.body.name,
                        host : options.Hostname
                    };

                    docker.inspect(response.Id).then(
                        function (response) {
                            data.ports = {
                                22 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 22}).PublicPort,
                                80 : _.findWhere(response.HostConfig.Ports, {PrivatePort : 80}).PublicPort
                            };

                            data.state = JSON.stringify(response.state);

                            db.hmset(req.body.name, data);
                            db.publish('container', 'created');
                            nginx.reload();
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
        } else {
            res.send({message : '`' + req.body.name + '` already exists'});
            res.sendStatus(422);

            res.end();
        }
    });
});

dbServer.put('/db/instance/:key', function(req, res) {
    db.exists(req.params.key).then(function (exists) {
        if (exists) {
            db.hmset(req.params.key, req.body);
            db.publish('container', 'updated');
            res.send(req.body);
        } else {
            res.sendStatus(404);
        }

        res.end();
    });
});

module.exports = dbServer;
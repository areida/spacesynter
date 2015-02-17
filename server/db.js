var Express    = require('express');
var Redis      = require('then-redis');
var bodyParser = require('body-parser')
var config     = require('../application/config');

var db = new Express();

var instanceDb, projectDb;

instanceDb = Redis.createClient({
    host     : 'localhost',
    port     : 6379,
    database : 3
});

projectDb  = Redis.createClient({
    host     : 'localhost',
    port     : 6379,
    database : 4
});

db.use(bodyParser.json());

function create(database, req, res) {
    database.exists(req.body.name).then(function (exists) {
        if (! exists) {
            database.hmset(req.body.name, req.body);
        } else {
            res.sendStatus(422);
        }

        res.end();
    });
}

function read(database, req, res) {
    database.exists(req.params.key).then(function (exists) {
        if (exists) {
            database.hget(req.params.key).then(function (item) {
                res.send(item);
                res.end();
            });
        } else {
            res.sendStatus(404);
            res.end();
        }
    });
}

function readAll(database, req, res) {
    database.keys('*').then(function (keys) {
        if (keys.length) {
            database.hgetall(keys).then(function (items) {
                res.send(items);
                res.end();
            });
        } else {
            res.send([]);
            res.end();
        }
    });
}

function update(database, req, res) {
    database.exists(req.params.key).then(function (exists) {
        if (exists) {
            database.hmset(req.params.key, req.body);
        } else {
            res.sendStatus(422);
        }

        res.end();
    });
}

function destroy(database, req, res) {
    database.exists(req.params.key).then(function (exists) {
        if (exists) {
            instanceDb.hdel(req.params.key);
        } else {
            res.sendStatus(422);
        }

        res.end();
    });
}

db.delete('/db/instance/:key', destroy.bind(undefined, instanceDb));
db.delete('/db/project/:key', destroy.bind(undefined, projectDb));
db.get('/db/instance/:key', read.bind(undefined, instanceDb));
db.get('/db/project/:key', read.bind(undefined, projectDb));
db.get('/db/instances', readAll.bind(undefined, instanceDb));
db.get('/db/projects', readAll.bind(undefined, projectDb));
db.patch('/db/instance/:key', update.bind(undefined, instanceDb));
db.patch('/db/project/:key', update.bind(undefined, projectDb));
db.post('/db/instance', create.bind(undefined, instanceDb));
db.post('/db/project', create.bind(undefined, projectDb));
db.put('/db/instance/:key', update.bind(undefined, instanceDb));
db.put('/db/project/:key', update.bind(undefined, projectDb));

module.exports = db;
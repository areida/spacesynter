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
    database.exists(req.body.name).then(function (reply) {
        if (! reply) {
            database.hmset(req.body.name, req.body);
        } else {
            res.sendStatus(422);
        }

        res.end();
    });
}

function read(database, req, res) {
    database.hget(req.params.key).then(function (reply) {
        res.send(reply);
        res.end();
    });
}

function readAll(database, req, res) {
    database.keys('*').then(function (reply) {
        database.hgetall(reply).then(function (reply) {
            res.send(reply);
            res.end();
        });
    });
}

function update(database, req, res) {
    database.exists(req.params.key).then(function (reply) {
        if (reply) {
            database.hmset(req.params.key, req.body);
        } else {
            res.sendStatus(422);
        }

        res.end();
    });
}

function destroy(database, req, res) {
    database.exists(req.params.key).then(function (reply) {
        if (reply) {
            instanceDb.hdel(req.params.key);
        } else {
            res.sendStatus(422);
        }

        res.end();
    });
}

db.delete('/db/instance/:key', function (req, res) {
    destroy(instanceDb, req, res);
});

db.get('/db/:key/instance', function (req, res) {
    read(instanceDb, req, res);
});

db.get('/db/instances', function (req, res) {
    readAll(instanceDb, req, res);
});

db.patch('/db/instance/:key', function (req, res) {
    update(instanceDb, req, res);
});

db.post('/db/instance', function (req, res) {
    create(instanceDb, req, res);
});

db.put('/db/instance/:key', function (req, res) {
    update(instanceDb, req, res);
});

db.delete('/db/project/:key', function (req, res) {
    destroy(projectDb, req, res);
});

db.get('/db/:key/project', function (req, res) {
    read(projectDb, req, res);
});

db.get('/db/projects', function (req, res) {
    readAll(projectDb, req, res);
});

db.patch('/db/project/:key', function (req, res) {
    update(projectDb, req, res);
});

db.post('/db/project', function (req, res) {
    create(projectDb, req, res);
});

db.put('/db/project/:key', function (req, res) {
    update(projectDb, req, res);
});

module.exports = db;
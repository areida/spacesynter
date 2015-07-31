'use strict';

var CookieParser = require('cookie-parser');
var Express      = require('express');
var fs           = require('fs');
var mongoose     = require('mongoose');
var Session      = require('express-session');
var RedisStore   = require('connect-redis')(Session);
var tmpl         = require('blueimp-tmpl').tmpl;

var config    = require('./config');
var auth      = require('./middleware/auth');
var container = require('./middleware/container');
var github    = require('./middleware/github');

var app, mongoClient;

mongoClient = mongoose.connect(config.mongoDb.host, config.mongoDb.name);

tmpl.load = function (name) {
    return fs.readFileSync(config.cwd + '/templates/' + name, 'utf8');
};

app = new Express();

app.use(new CookieParser());
app.use(new Session({
    resave            : false,
    saveUninitialized : false,
    secret            : config.redis.cookies.secret,
    store             : new RedisStore(config.redis.cookies)
}));

if (config.auth) {
    app.use(auth);
    app.use(github);
}

app.use('/api', container);

app.get(/^([^.]+)$/, function (req, res) {
    res.send(tmpl('index.html', {}));
});

app.use(Express.static(config.cwd + '/build'));

app.listen(config.port, 10, function () {
    console.log('Listening on localhost:' + config.port);
});

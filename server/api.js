global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';

var bodyParser   = require('body-parser');
var CookieParser = require('cookie-parser');
var Express      = require('express');
var http         = require('http');
var mongoose     = require('mongoose');
var Session      = require('express-session');
var RedisStore   = require('connect-redis')(Session);

var config    = require('./config');
var auth      = require('./middleware/auth');
var container = require('./middleware/container');

var api, mongoClient;

mongoClient = mongoose.connect('localhost', 'test');

api = new Express();

api.disable('etag');
api.use(bodyParser.json());
api.use(new CookieParser());
api.use(new Session({
    resave            : false,
    saveUninitialized : false,
    secret            : config.redis.cookies.secret,
    store             : new RedisStore(config.redis.cookies)
}));

api.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Filename');
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST');
    res.header('Content-Type', 'application/json');
    res.header('If-None-Match', '*');
    res.header('Last-Modified', (new Date()).toUTCString());
    next();
});

if (config.auth) {
    api.use(auth);
}

api.use(container);

api.listen(config.api.port, 10, function () {
    console.log('Listening on localhost:' + config.api.port);
});

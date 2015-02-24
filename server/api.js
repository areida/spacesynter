global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';

var bodyParser   = require('body-parser');
var CookieParser = require('cookie-parser');
var Express      = require('express');
var http         = require('http');
var Io           = require('socket.io');
var mongoose     = require('mongoose');
var Redis        = require('then-redis');
var Session      = require('express-session');
var RedisStore   = require('connect-redis')(Session);

var config     = require('./config');
var containers = require('./containers');
var docker     = require('./docker');
var nginx      = require('./nginx');

var api, mongoClient;

mongoClient = mongoose.connect('localhost', 'test');

api = new Express();
io  = new Io(http.createServer(api));

io.on('connection', function (socket) {
    socket.emit('connected');
});

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
    res.header(
        'Access-Control-Allow-Origin',
        process.env.HOSTNAME || ('http://' + config.app.hostname + ':' + config.app.port)
    );
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, POST, PUT');
    res.header('Content-Type', 'application/json');
    res.header('If-None-Match', '*');
    res.header('Last-Modified', (new Date()).toUTCString());
    req.io = io;
    next();
});

if (config.api.auth) {
    api.use(auth.check);
}

api.use(containers);

api.listen(
    config.api.port,
    config.api.hostname,
    10,
    function () {
        console.log('Listening on ' + config.api.hostname + ':' + config.api.port);
    }
);

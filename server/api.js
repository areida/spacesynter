global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';

var bodyParser   = require('body-parser');
var CookieParser = require('cookie-parser');
var Express      = require('express');
var Io           = require('socket.io');
var Redis        = require('then-redis');
var Session      = require('express-session');
var RedisStore   = require('connect-redis')(Session);

var config         = require('../application/config');
var containers     = require('./containers');
var mockContainers = require('./mock-containers');
var docker         = require('./docker');
var nginx          = require('./nginx');

var api, redisClient;

redisClient = Redis.createClient(config.redis.containers);

api = new Express();

api.use(bodyParser.json());
api.use(new CookieParser());
api.use(new Session({
    resave            : false,
    saveUninitialized : false,
    secret            : config.redis.cookies.secret,
    store             : new RedisStore(config.redis.cookies)
}));

if (config.api.auth) {
    app.use(auth.check);
}

if (config.api.docker) {
    api.use(containers);
} else {
    app.use(mockContainers);
}

httpServer = api.listen(
    config.api.port,
    config.api.hostname,
    10,
    function () {
        console.log('Listening on ' + config.api.hostname + ':' + config.api.port);
    }
);

io = new Io(httpServer);

io.on('connection', function (socket) {
    socket.emit('connected');
});

redisClient.on('message', function (channel, message) {
    if (
        channel === 'container' &&
        ['created', 'killed', 'recreated'].indexOf(message) !== -1
    ) {
        nginx.reload().then(function () {
            io.emit(channel, {message : messsage});
        });
    }
});

redisClient.subscribe('container');
require('node-jsx').install({
    extension : '.jsx'
});

global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.localStorage    = require('localStorage');
global.navigator       = require('navigator');

var Express      = require('express');
var Fs           = require('fs');
var Session      = require('express-session');
var CookieParser = require('cookie-parser');
var RedisStore   = require('connect-redis')(Session);
var Redis        = require('then-redis');
var Io           = require('socket.io');
var Tmpl         = require('blueimp-tmpl').tmpl;

var app    = require('./server/app');
var auth   = require('./server/auth');
var db     = require('./server/db');
var config = require('./application/config');

var dbClient, io, httpServer, server;

Tmpl.load = function (name) {
    return Fs.readFileSync(process.cwd() + '/templates/' + name, 'utf8');
};

dbClient = Redis.createClient(config.redis);

server = new Express();

server.use(new CookieParser());
server.use(new Session({
    resave            : false,
    saveUninitialized : false,
    secret            : (process.env.SESSION_KEY || 'test key'),
    store             : new RedisStore({
        host : process.env.REDIS_HOST || 'localhost',
        port : process.env.REDIS_PORT || 6379,
        db   : process.env.REDIS_DB   || 2,
    })
}));

server.use(Express.static(process.cwd() + '/build'));
//server.use(auth);
server.use(db);
server.use(app);

httpServer = server.listen(config.server.port, config.server.hostname, 10, function () {
    console.log('Listening on ' + config.server.hostname + ':' + config.server.port);
});

io = new Io(httpServer);

io.on('connection', function (socket) {
    socket.emit('connected');
});

dbClient.on('message', function (channel, message) {
    if (['created', 'killed', 'recreated'].indexOf(message) !== -1) {
        dbClient.keys('*').then(function (keys) {
            console.log(keys);
            if (keys.length) {
                db.hgetall(keys).then(function (containers) {
                    nginx.reload(containers, function () {
                        io.emit(channel, {message : messsage});
                    });
                });
            } else {
                nginx.reload(function () {
                    io.emit(channel, {message : messsage});
                });
            }
        });
    }
});

dbClient.subscribe('container');

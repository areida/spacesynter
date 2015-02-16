require('node-jsx').install({
    extension : '.jsx'
});

global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.localStorage    = require('localStorage');
global.navigator       = require('navigator');

var Express      = require('express');
var Session      = require('express-session');
var CookieParser = require('cookie-parser');
var RedisStore   = require('connect-redis')(Session);

var appServer = require('./server/app');
var config    = require('./application/config');

var app = new Express();

app.use(new CookieParser());
app.use(new Session({
    resave            : false,
    saveUninitialized : false,
    secret            : (process.env.SESSION_KEY || 'test key'),
    store             : new RedisStore({
        host : process.env.REDIS_HOST || 'localhost',
        port : process.env.REDIS_PORT || 6379,
        db   : process.env.REDIS_DB   || 2,
    })
}));

app.get('/?', appServer.get);
app.get('/gists/:username/?', appServer.get);
app.get('/login/?', appServer.get);
app.get('/gists/?', appServer.redirects.gists)
app.get('/logout/?', appServer.logout);
app.get('/gh-login/?', appServer.githubLogin);
app.get('/gh-callback/?', appServer.githubCallback);

if (__ENVIRONMENT__ !== 'production') {
    app.get('/style-guide(/:section)?/?', appServer.get);
}

app.use(Express.static(process.cwd() + '/build'));

console.log('Listening on ' + config.server.hostname + ':' + config.server.port);
app.listen(config.server.port);

global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.localStorage    = require('localStorage');
global.navigator       = require('navigator');

var Express      = require('express');
var Session      = require('express-session');
var CookieParser = require('cookie-parser');
var RedisStore   = require('connect-redis')(Session);

var config = require('./config');
var auth   = require('./middleware/auth');
var github = require('./middleware/github');
var render = require('./middleware/render-generated');

var app = new Express();

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

app.get(/^([^.]+)$/, render);

if (__ENVIRONMENT__ !== 'production') {
    app.use(Express.static(process.cwd() + '/build'));
}

app.listen(config.app.port, 10, function () {
    console.log('Listening on localhost:' + config.app.port);
});

require('node-jsx').install({
    extension : '.jsx'
});

global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.localStorage    = require('localStorage');
global.navigator       = require('navigator');

var Express      = require('express');
var Fs           = require('fs');
var React        = require('react');
var Router       = require('react-router');
var Session      = require('express-session');
var CookieParser = require('cookie-parser');
var RedisStore   = require('connect-redis')(Session);
var Redis        = require('then-redis');
var Tmpl         = require('blueimp-tmpl').tmpl;

var auth   = require('./auth');
var config = require('../application/config');
var Flux   = require('../application/flux');
var github = require('./github');
var routes = require('../application/routes');

var app = new Express();

Tmpl.load = function (name) {
    return Fs.readFileSync(process.cwd() + '/templates/' + name, 'utf8');
};

app.use(new CookieParser());
app.use(new Session({
    resave            : false,
    saveUninitialized : false,
    secret            : config.redis.cookies.secret,
    store             : new RedisStore(config.redis.cookies)
}));

if (config.app.auth) {
    app.use(auth);
}

app.use(github);

app.get(/^([^.]+)$/, function (req, res, next) {
    localStorage.setItem('token', req.session.ghToken ? JSON.stringify(req.session.ghToken) : null);

    Router.run(routes, req.url, function (Handler, state) {
        var flux = new Flux();

        flux.fetchData(state).done(function () {
            var Factory = React.createFactory(Handler);

            res.send(Tmpl('index.html', {
                flux : JSON.stringify(flux.toObject()),
                host : config.api.hostname + ':' + config.api.port,
                html : React.renderToString(new Factory({flux : flux})),
            }));
        });
    });
});

app.use(Express.static(process.cwd() + '/build'));

app.listen(config.app.port, config.app.hostname, 10, function () {
    console.log('Listening on ' + config.app.hostname + ':' + config.app.port);
});

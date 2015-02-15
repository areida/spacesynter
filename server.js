require('node-jsx').install({
    extension : '.jsx'
});

global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.localStorage    = require('localStorage');
global.navigator       = require('navigator');

var Express      = require('express');
var session      = require('express-session');
var RedisStore   = require('connect-redis')(session);
var cookieParser = require('cookie-parser');

var Fs     = require('fs');
var React  = require('react');
var Router = require('react-router');
var Tmpl   = require('blueimp-tmpl').tmpl;

var config = require('./application/config');
var routes = require('./application/routes');

var githubOAuth = require('github-oauth')({
    githubClient : process.env.GITHUB_CLIENT,
    githubSecret : process.env.GITHUB_SECRET,
    baseURL      : process.env.BASE_URL || (config.server.hostname + ':' + config.server.port),
    loginURI     : '/login',
    callbackURI  : '/callback',
    scope        : 'gist'
});

var app = Express();

app.use(cookieParser());
app.use(session({
    resave            : false,
    saveUninitialized : false,
    secret            : (process.env.SESSION_KEY || '26hiowop34uuy723245rqatdfgh5234tfmgh24sdg'),
    store             : new RedisStore({
        host : process.env.REDIS_HOST || 'localhost',
        port : process.env.REDIS_PORT || 6379,
        db   : process.env.REDIS_DB   || 2,
    })
}));

Tmpl.load = function () {
    return Fs.readFileSync(process.cwd() + '/application/index.html', 'utf8');
};

function GET(req, res)
{
    if (req.session.token) {
        localStorage.setItem('token', JSON.stringify(req.session.token));
    }

    Router.run(routes, req.url, function (Handler, state) {
        var flux = require('./application/flux');

        flux.fetchData(state).done(function () {
            var Factory = React.createFactory(Handler);

            res.send(Tmpl('page', {
                flux : JSON.stringify(flux.toObject()),
                html : React.renderToString(new Factory({flux : flux})),
            }));

            res.end();
        });
    });
}

app.get('/?', GET);
app.get('/gists/:username', GET);
app.get('/style-guide(/:section)?', GET);
app.get('/gists', function (req, res) {
    if (req.params.username) {
        res.redirect(302, req.url + '/' + req.params.username);
    } else {
        GET(req, res);
    }
});

app.all('/callback/', function (req, res) {
    githubOAuth.callback(req, res, function (err, token) {
        if (err) {
            console.error('there was a login error', err);
            res.redirect(403, '/');
        } else {
            req.session.token = token;
            res.redirect(302, '/');
        }
    });
});

app.all('/login/', githubOAuth.login);

app.use(Express.static(process.cwd() + '/build'));

console.log('Listening on ' + config.server.hostname + ':' + config.server.port);
app.listen(config.server.port);

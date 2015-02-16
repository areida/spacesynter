var Fs     = require('fs');
var React  = require('react');
var Router = require('react-router');
var Tmpl   = require('blueimp-tmpl').tmpl;

var config = require('../application/config');
var Flux   = require('../application/flux');
var routes = require('../application/routes');

var Github   = require('./github');
var ghClient = new Github({
    ghClientId     : process.env.GH_CLIENT_ID,
    ghClientSecret : process.env.GH_CLIENT_SECRET,
    baseUrl        : process.env.BASE_URL || 'http://' + (config.server.hostname + ':' + config.server.port),
    callbackUri    : '/gh-callback',
    scope          : 'gist'
});

Tmpl.load = function () {
    return Fs.readFileSync(process.cwd() + '/application/index.html', 'utf8');
};

var appServer =  {
    get : function(req, res)
    {
        if (req.session.ghToken || req.url === '/login') {
            localStorage.setItem('token', req.session.ghToken ? JSON.stringify(req.session.ghToken) : null);

            Router.run(routes, req.url, function (Handler, state) {
                var flux = new Flux();

                flux.fetchData(state).done(function () {
                    var Factory = React.createFactory(Handler);

                    res.send(Tmpl('page', {
                        flux : JSON.stringify(flux.toObject()),
                        html : React.renderToString(new Factory({flux : flux})),
                    }));

                    res.end();
                });
            });
        } else {
            req.session.redirectUrl = req.url;
            res.redirect(302, '/login');
            res.end();
        }
    },
    githubCallback : function (req, res)
    {
        if (! req.query.code || ! req.session.ghState) {
            res.redirect(302, '/login');
            res.end();
        } else {
            ghClient.callback(req.query.code, req.session.state)
                .then(
                    function (token) {
                        var redirectUrl = req.session.redirectUrl || '/';
                        req.session.ghState     = null;
                        req.session.ghToken     = token;
                        req.session.redirectUrl = null;
                        res.redirect(302, redirectUrl);
                        res.end();
                    },
                    function (error) {
                        console.error('there was a login error', error);
                        res.redirect(403, '/');
                        res.end();
                    }
                )
                .done();
        }
    },
    githubLogin : function(req, res)
    {
        req.session.ghState = ghClient.createState();

        res.redirect(302, ghClient.authorizeUrl(req.session.state));
        res.end();
    },
    logout : function(req, res)
    {
        req.session.ghToken = null;

        if (req.headers['content-type'] === 'application/json') {
            res.end();
        } else {
            res.redirect(302, '/login');
            res.end(); 
        }
    },
    redirects : {
        gists : function (req, res)
        {
            if (req.params.username) {
                res.redirect(302, req.url + '/' + req.params.username);
                res.end();
            } else {
                AppServer.get(req, res);
            }
        }
    }
};

module.exports = appServer;
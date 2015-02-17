var Express = require('express');
var Fs      = require('fs');
var path    = require('path');
var React   = require('react');
var Router  = require('react-router');
var Tmpl    = require('blueimp-tmpl').tmpl;

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

var app = new Express();

app.get(/^([^.]+)$/, function (req, res, next) {
    if (path.extname(req.url) !== '') {
        next();
    } else {
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
    }
});

module.exports = app;
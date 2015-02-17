var Express = require('express');

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

var auth = new Express();

auth.get('/logout/?', function (req, res) {
    req.session.ghToken = null;

    if (req.headers['content-type'] === 'application/json') {
        res.end();
    } else {
        res.redirect(302, '/login');
        res.end(); 
    }
});
auth.get('/gh-login/?', function (req, res) {
    req.session.ghState = ghClient.createState();

    res.redirect(302, ghClient.authorizeUrl(req.session.state));
    res.end();
});
auth.get('/gh-callback/?', function (req, res) {
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
});
auth.all(/^([^.]+)$/, function (req, res, next) {
    if (req.session.ghToken || req.url === '/login') {
        next();
    } else {
        req.session.redirectUrl = req.url;
        res.redirect(302, '/login');
        res.end();
    }
});

module.exports = auth;
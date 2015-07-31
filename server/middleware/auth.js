'use strict';

var Express = require('express');

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

auth.all(/^([^.]+)$/, function (req, res, next) {
    if (req.session.ghToken || req.url === '/login') {
        next();
    } else {
        req.session.redirectUrl = req.url;
        res.redirect(403, '/login');
        res.end();
    }
});

module.exports = auth;

'use strict';

var Express = require('express');

var auth = new Express();

auth.get('/logout/?', function (req, res) {
    req.session.ghToken = null;

    if (req.headers['content-type'] === 'application/json') {
        res.end();
    } else {
        res.redirect('/login');
    }
});

auth.all(/^([^.]+)$/, function (req, res, next) {
    if (req.session.ghToken || req.url === '/login') {
        next();
    } else {
        req.session.redirectUrl = req.url;
        res.redirect('/login');
    }
});

module.exports = auth;

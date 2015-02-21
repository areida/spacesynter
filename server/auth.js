var Express   = require('express');
var appConfig = require('../application/config');
var config    = require('./config');

var auth  = new Express();

auth.all(/^([^.]+)$/, function (req, res, next) {
    if (
        req.session.ghToken ||
        (req.hostname === config.app.hostname && req.url === appConfig.loginUri)
    ) {
        next();
    } else {
        req.session.redirectUrl = req.url;
        res.redirect(302, appConfig.loginUri);
        res.end();
    }
});

module.exports = auth;
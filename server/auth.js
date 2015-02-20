var Express = require('express');
var config = require('../application/config');

var auth  = new Express();

auth.all(/^([^.]+)$/, function (req, res, next) {
    if (
        req.session.ghToken ||
        (req.hostname === config.app.hostname && req.url === config.app.loginUri)
    ) {
        next();
    } else {
        req.session.redirectUrl = req.url;
        res.redirect(302, config.app.loginUri);
        res.end();
    }
});

module.exports = auth;
var Express = require('express');

var config = require('../../application/config');

var auth  = new Express();

auth.all(/^([^.]+)$/, function (req, res, next) {
    if (req.session.ghToken || req.url === config.login_url) {
        next();
    } else {
        req.session.redirectUrl = req.url;
        res.redirect(403, config.login_url);
        res.end();
    }
});

module.exports = auth;
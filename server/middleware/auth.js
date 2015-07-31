var Express = require('express');

var auth = new Express();

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
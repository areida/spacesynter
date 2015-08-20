'use strict';

var Express = require('express');
var fs      = require('fs');
var path    = require('path');
var proxy   = require('express-http-proxy');

var app = new Express();

app.use(config.api.prefix, proxy('http://' + process.env.BACKEND, {
    limit : '50mb'
}));

app.use(function (req, res, next) {
    var ext = path.extname(req.url);

    if ((ext === '' || ext === '.html') && req.url !== '/') {
        res.sendFile('index.html', {root : process.env.CWD});
    } else {
        next();
    }
});

app.use(Express.static(process.env.CWD));

app.listen(process.env.PORT, 10, function () {
    console.log('Listening on localhost:' + process.env.PORT);
});

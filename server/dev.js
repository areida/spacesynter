'use strict';

global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.__BACKEND__     = process.env.BACKEND || '';

var path             = require('path');
var request          = require('request');
var WebpackDevServer = require('webpack-dev-server');
var webpack          = require('webpack');

var config        = require('./config');
var webpackConfig = require('../webpack.config');

var server = new WebpackDevServer(webpack(webpackConfig), {
    headers : {'Access-Control-Allow-Origin': '*'},
    hot     : true,
    noInfo  : true,
    proxy   : {'*' : {target : 'http://localhost:' + config.port}}
});

server.use(function (req, res, next) {
    var ext = path.extname(req.url);

    if ((ext === '' || ext === '.html') && req.url !== '/') {
        req.pipe(request('http://localhost:9000')).pipe(res);
    } else {
        next();
    }
});

server.listen(9000, function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log('Listening at localhost:' + 9000);
});

global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.__BACKEND__     = process.env.BACKEND || '';

var path             = require('path');
var request          = require('request');
var WebpackDevServer = require('webpack-dev-server');
var webpack          = require('webpack');
var config           = require('./webpack.config');
var appConfig        = require('./application/config');

var server = new WebpackDevServer(webpack(config), {
    contentBase : appConfig.server.port,
    headers     : {'Access-Control-Allow-Origin': '*'},
    hot         : true,
    inline      : true,
    noInfo      : true
});

server.use(function (req, res, next) {
    var ext = path.extname(req.url);

    if ((ext === '' || ext === '.html') && req.url !== '/') {
        req.pipe(request('http://' + appConfig.devServer.hostname + ':' + appConfig.devServer.port)).pipe(res);
    } else {
        next();
    }
});

server.listen(appConfig.devServer.port, appConfig.devServer.hostname, function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log('Listening at ' + appConfig.devServer.hostname + ':' + appConfig.devServer.port);
});

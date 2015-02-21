global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.__BACKEND__     = process.env.BACKEND || '';

var path             = require('path');
var request          = require('request');
var WebpackDevServer = require('webpack-dev-server');
var webpack          = require('webpack');
var webpackConfig    = require('./webpack.config');
var config           = require('./server/config');

var server = new WebpackDevServer(webpack(webpackConfig), {
    contentBase : __dirname + '/build',
    headers     : {'Access-Control-Allow-Origin': '*'},
    hot         : true,
    inline      : true,
    noInfo      : true
});

server.use(function (req, res, next) {
    var ext = path.extname(req.url);

    if ((ext === '' || ext === '.html') && req.url !== '/') {
        req.pipe(
            request('http://' + config.devServer.hostname + ':' + config.devServer.port)
        ).pipe(res);
    } else {
        next();
    }
});

server.listen(config.devServer.port, config.devServer.hostname, function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log('Listening at ' + config.devServer.hostname + ':' + config.devServer.port);
});

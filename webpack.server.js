var fs                = require('fs');
var Webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackError      = require('webpack-error-notification');

var environment = (process.env.APP_ENV || 'development');
var npmDir      = __dirname + '/node_modules';

var externals = {};
var plugins   = [
    new ExtractTextPlugin('app.css', {allChunks : true}),
    new Webpack.DefinePlugin({
        __BACKEND__     : '\''+process.env.BACKEND+'\'',
        __ENVIRONMENT__ : '\''+environment+'\''
    })
];

fs.readdirSync('node_modules')
    .filter(
        function (x) {
            return ['.bin'].indexOf(x) === -1;
        }
    )
    .forEach(
        function (mod) {
            externals[mod] = 'commonjs ' + mod;
        }
    );


if (environment === 'development') {
    plugins.push(new WebpackError(process.platform));
}

module.exports = {
    name   : 'server bundle',
    entry  : './server/middleware/render.js',
    output : {
        filename      : '../server/middleware/render-generated.js',
        libraryTarget : 'commonjs2',
        path          : __dirname + '/build'
    },
    target : 'node',
    module : {
        preLoaders : [
            {
                test    : /\.jsx?$/,
                loader  : 'jsxhint-loader',
                exclude : npmDir
            }
        ],
        loaders : [
            {
                test   : /\.(eot|ico|jpg|png|svg|ttf|woff|woff2)$/,
                loader : 'file-loader',
                query  : {name : '[path][name].[ext]'}
            },
            {
                test    : /\.jsx?$/,
                loaders : ['jsx-loader?insertPragma=React.DOM&harmony'],
                exclude : npmDir
            },
            {
                test   : /\.json$/,
                loader : 'json-loader'
            },
            {
                test   : /\.scss$/,
                loader : ExtractTextPlugin.extract(
                    'style-loader',
                    'css-loader!sass-loader?outputStyle=compressed&includePaths[]=' + npmDir
                )
            }
        ]
    },
    externals : externals,
    plugins   : plugins,
    resolve   : {
        extensions : ['', '.js', '.json', '.jsx', '.webpack.js', '.web.js']
    },
    jshint  : {
        esnext       : true,
        globalstrict : true,
        globals      : {
            __BACKEND__     : true,
            console         : true,
            __ENVIRONMENT__ : true,
            window          : true
        }
    }
};

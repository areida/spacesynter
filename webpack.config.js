var Webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpack       = require('html-webpack-plugin');
var WebpackError      = require('webpack-error-notification');

var environment = (process.env.APP_ENV || 'development');
var config = {
    entry   : ['./application/bootstrap.js'],
    plugins : [
        new HtmlWebpack({template : './application/index.html'}),
        new Webpack.DefinePlugin({
            __BACKEND__     : process.env.BACKEND,
            __ENVIRONMENT__ : '\''+environment+'\''
        })
    ],
    reactLoaders : ['jsx?insertPragma=React.DOM'],
    sassLoader   : {
        test   : /\.scss$/,
        loader : 'style-loader!css-loader!sass-loader?outputStyle=nested&includePaths[]=' + __dirname + '/node_modules'
    }
};

if (environment === 'development') {
    config.entry = [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:9000'
    ].concat(config.entry);

    config.reactLoaders = ['react-hot'].concat(config.reactLoaders);

    config.plugins = config.plugins.concat([
        new Webpack.HotModuleReplacementPlugin(),
        new WebpackError(process.platform)
    ]);
}

if (environment === 'production' || process.env.SERVER) {
    config.plugins    = config.plugins.concat([new ExtractTextPlugin('app.css', {allChunks : true})]);
    config.sassLoader = {
        test   : /\.scss$/,
        loader : ExtractTextPlugin.extract(
            'style-loader',
            'css-loader!sass-loader?outputStyle=nested&includePaths[]=' + __dirname + '/node_modules'
        )
    };
}

module.exports = {
    name   : 'browser bundle',
    entry  : config.entry,
    output : {
        filename   : 'app.js',
        path       : __dirname + '/build',
        publicPath : '/'
    },
    module : {
        preLoaders : [
            {
                test    : /\.js?/,
                loader  : 'jshint-loader',
                exclude : __dirname + '/node_modules'
            },
            {
                test    : /\.jsx?/,
                loader  : 'jsxhint-loader',
                exclude : __dirname + '/node_modules'
            }
        ],
        loaders : [
            {
                test   : /\.(eot|ico|jpg|png|svg|ttf|woff|woff2)$/,
                loader : 'file-loader',
                query  : {name : '[path][name].[ext]'}
            },
            {
                test    : /\.jsx$/,
                loaders : config.reactLoaders,
                exclude : __dirname + '/node_modules'
            },
            {
                test   : /\.json$/,
                loader : 'json-loader'
            },
            config.sassLoader
        ]
    },
    plugins : config.plugins,
    resolve : {
        extensions : ['', '.js', '.json', '.jsx', '.webpack.js', '.web.js']
    },
    devtool : '#inline-source-map',
};

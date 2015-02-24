var Webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpack       = require('html-webpack-plugin');
var WebpackError      = require('webpack-error-notification');

var environment = (process.env.APP_ENV || 'development');
var npmDir      = __dirname + '/node_modules';

var config = {
    entry   : ['./application/bootstrap.js'],
    plugins : [
        new Webpack.DefinePlugin({
            __BACKEND__     : '\''+process.env.BACKEND+'\'',
            __ENVIRONMENT__ : '\''+environment+'\'',
            __SERVER__      : '\''+process.env.SERVER+'\''
        })
    ],
    reactLoaders : ['jsx?insertPragma=React.DOM&harmony'],
    sassLoader   : {
        test   : /\.scss$/,
        loader : 'style-loader!css-loader!sass-loader?outputStyle=nested&includePaths[]=' + npmDir
    }
};

if (environment === 'development') {
    config.plugins.push(new WebpackError(process.platform));

    if (! process.env.SERVER) {
        config.entry.unshift('webpack-dev-server/client?http://localhost:9000')
        config.entry.unshift('webpack/hot/dev-server')
        config.plugins.push(new Webpack.HotModuleReplacementPlugin());
        config.plugins.push(new HtmlWebpack({template : './templates/index.html'}));
        config.reactLoaders.unshift('react-hot');
    }
}

if (environment === 'production' || process.env.SERVER) {
    config.plugins.push(new ExtractTextPlugin('app.css', {allChunks : true}));
    config.sassLoader = {
        test   : /\.scss$/,
        loader : ExtractTextPlugin.extract(
            'style-loader',
            'css-loader!sass-loader?outputStyle=compressed&includePaths[]=' + npmDir
        )
    };
}

module.exports = {
    name   : 'browser bundle',
    entry  : config.entry,
    output : {
        filename   : 'app.js',
        path       : __dirname + '/build',
        publicPath : 'http://localhost:9000/'
    },
    module : {
        preLoaders : [
            {
                test    : /\.js?/,
                loader  : 'jshint-loader',
                exclude : npmDir
            },
            {
                test    : /\.js?/,
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
                test    : /\.(js|jsx)$/,
                loaders : config.reactLoaders,
                exclude : npmDir
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
    jshint  : {
        esnext       : true,
        globalstrict : true
    }
};

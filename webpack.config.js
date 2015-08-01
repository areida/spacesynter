var ExtractText  = require('extract-text-webpack-plugin');
var Webpack      = require('webpack');
var WebpackError = require('webpack-error-notification');

var environment = (process.env.APP_ENV || 'development');
var npmDir      = __dirname + '/node_modules';

var config = {
    entry   : ['./application/bootstrap.js'],
    plugins : [
        new ExtractText('app.css', {allChunks : true}),
        new Webpack.DefinePlugin({
            __BACKEND__     : '\'' + process.env.BACKEND + '\'',
            __ENVIRONMENT__ : '\'' + environment + '\''
        })
    ],
    reactLoaders : ['jsx-loader?insertPragma=React.DOM&harmony']
};

if (environment === 'development') {
    config.plugins.push(new WebpackError(process.platform));

    config.entry.unshift('webpack-dev-server/client?http://localhost:9000');
    config.entry.unshift('webpack/hot/dev-server');
    config.plugins.push(new Webpack.HotModuleReplacementPlugin());
    config.reactLoaders.unshift('react-hot');
}

module.exports = {
    name   : 'browser bundle',
    entry  : config.entry,
    output : {
        filename : 'app.js',
        path     : __dirname + '/build'
    },
    module : {
        preLoaders : [
            {
                test    : /\.jsx?/,
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
                test    : /\.js$/,
                loaders : config.reactLoaders,
                exclude : npmDir
            },
            {
                test   : /\.json$/,
                loader : 'json-loader'
            },
            {
                test   : /\.scss$/,
                loader : 'style-loader!css-loader!sass-loader?outputStyle=nested&includePaths[]=' + npmDir
            },
            {
                test   : /\.scss$/,
                loader : ExtractText.extract(
                    'style-loader',
                    'css-loader!sass-loader?outputStyle=compressed&includePaths[]=' + npmDir
                )
            }
        ]
    },
    plugins : config.plugins,
    resolve : {
        extensions : ['', '.js', '.json', '.jsx', '.webpack.js', '.web.js']
    },
    devtool : '#inline-source-map',
    jshint  : {
        esnext       : true,
        globalstrict : true,
        globals      : {
            __BACKEND__     : true,
            __ENVIRONMENT__ : true,
            JSON            : true,
            console         : true,
            document        : true,
            window          : true
        }
    }
};

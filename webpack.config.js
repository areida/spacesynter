var Webpack      = require('webpack');
var WebpackError = require('webpack-error-notification');

var environment = (process.env.APP_ENV || 'development');
var npmDir      = __dirname + '/node_modules';

var config = {
    entries : {
        app   : ['./application/bootstrap.js'],
        media : ['./application/media.js']
    },
    plugins : [],
    react   : ['babel']
};

if (environment === 'development') {
    config.entries.app.unshift(
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:9000'
    );
    config.entries.media.unshift(
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:9000'
    );
    config.plugins.push(new WebpackError(process.platform));
    config.plugins.push(new Webpack.HotModuleReplacementPlugin());
    config.react.unshift('react-hot');
}

module.exports = [
    {
        name   : 'app',
        entry  : config.entries.app,
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
                    loaders : config.react,
                    exclude : npmDir
                },
                {
                    test   : /\.json$/,
                    loader : 'json-loader'
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
                JSON     : true,
                console  : true,
                document : true,
                window   : true
            }
        }
    },
    {
        name   : 'media',
        entry  : config.entries.media,
        output : {
            filename : 'media.js',
            path     : __dirname + '/build'
        },
        module : {
            loaders : [
                {
                    test   : /\.(eot|ico|jpg|png|svg|ttf|woff|woff2)$/,
                    loader : 'file-loader',
                    query  : {name : '[path][name].[ext]'}
                },
                {
                    test    : /\.js$/,
                    loaders : config.react,
                    exclude : npmDir
                },
                {
                    test   : /\.scss$/,
                    loader : 'style-loader!css-loader!sass-loader?outputStyle=nested&includePaths[]=' + npmDir
                }
            ]
        },
        plugins : config.plugins,
        resolve : {
            extensions : ['', '.js', '.scss', '.webpack.js', '.web.js']
        },
        devtool : '#inline-source-map'
    }
];

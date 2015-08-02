var Webpack      = require('webpack');
var WebpackError = require('webpack-error-notification');

var environment = (process.env.APP_ENV || 'development');
var npmDir      = __dirname + '/node_modules';

var config = {
    entries : {
        app   : ['./application/bootstrap.js'],
        media : ['./application/media.js']
    },
    plugins : [
        new Webpack.DefinePlugin({
            __BACKEND__     : '\'' + process.env.BACKEND + '\'',
            __ENVIRONMENT__ : '\'' + environment + '\''
        })
    ],
    reactLoaders : ['babel']
};

if (environment === 'development') {
    config.plugins.push(new WebpackError(process.platform));

    config.entries.app.unshift('webpack-dev-server/client?http://localhost:9000');
    config.entries.media.unshift('webpack-dev-server/client?http://localhost:9000');
    config.entries.app.unshift('webpack/hot/dev-server');
    config.entries.media.unshift('webpack/hot/dev-server');
    config.plugins.push(new Webpack.HotModuleReplacementPlugin());
    config.reactLoaders.unshift('react-hot');
}

module.exports = [
    {
        name   : 'browser bundle',
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
                    loaders : config.reactLoaders,
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
                __BACKEND__     : true,
                __ENVIRONMENT__ : true,
                JSON            : true,
                console         : true,
                document        : true,
                window          : true
            }
        }
    },
    {
        name   : 'media bundle',
        entry  : config.entries.media,
        output : {
            filename : 'media.js',
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
    }
];

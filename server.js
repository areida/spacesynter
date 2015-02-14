require('node-jsx').install({
    extension : '.jsx'
});

global.__BACKEND__     = process.env.BACKEND || '';
global.__ENVIRONMENT__ = process.env.APP_ENV || 'development';
global.localStorage    = require('localStorage');
global.navigator       = require('navigator');

var Express = require('express');

var Fs     = require('fs');
var React  = require('react');
var Router = require('react-router');
var Tmpl   = require('blueimp-tmpl').tmpl;

var config = require('./application/config');
var routes = require('./application/routes');

var app = Express();

Tmpl.load = function () {
    return Fs.readFileSync(process.cwd() + '/application/index.html', 'utf8');
};

app.use(Express.static(process.cwd() + '/build'));

var serveApp = function (req, res) {
    Router.run(routes, req.url, function (Handler, state) {
        var flux = require('./application/flux');

        flux.fetchData(state).done(function () {
            var Factory = React.createFactory(Handler);

            React.withContext({flux : flux}, function() {
                res.send(Tmpl('page', {
                    flux : JSON.stringify(flux.toObject()),
                    html : React.renderToString(new Factory()),
                }));

                res.end();
            });
        });
    });
};

app.get('/', serveApp);
app.get('/style-guide(/:section)?', serveApp);

console.log('Listening on localhost:' + config.server.port);
app.listen(config.server.port);

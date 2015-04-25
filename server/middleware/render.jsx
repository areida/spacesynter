
var Fs     = require('fs');
var React  = require('react');
var Router = require('react-router');
var Tmpl   = require('blueimp-tmpl').tmpl;

var config = require('../config');
var Flux   = require('../../application/flux');
var routes = require('../../application/routes');

Tmpl.load = function (name) {
    return Fs.readFileSync(process.cwd() + '/templates/' + name, 'utf8');
};

module.exports = function (req, res) {
    localStorage.setItem('token', req.session.ghToken ? JSON.stringify(req.session.ghToken) : null);

    Router.run(routes, req.url, function (Handler, state) {
        var flux = new Flux();

        flux.fetchData(state).done(function () {
            var Factory = React.createFactory(Handler);

            res.send(Tmpl('index.html', {
                flux : JSON.stringify(flux.toObject()),
                host : config.api.hostname,
                html : React.renderToString(new Factory({flux : flux})),
            }));
        });
    });
}
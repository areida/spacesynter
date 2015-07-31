'use strict';

var fs     = require('fs');
var React  = require('react');
var Router = require('react-router');
var tmpl   = require('blueimp-tmpl').tmpl;

var config = requier('../config');
var Flux   = require('../../application/flux');
var routes = require('../../application/routes');

require('../../application/ui/scss/app.scss');

tmpl.load = function (name) {
    return fs.readFileSync(config.cwd + '/templates/' + name, 'utf8');
};

module.exports = function (req, res) {
    localStorage.setItem('token', req.session.ghToken ? JSON.stringify(req.session.ghToken) : null);

    Router.run(
        routes, req.url,
        function (Handler, state) {
            var flux = new Flux();

            flux.fetchData(state).done(
                function () {
                    var Factory = React.createFactory(Handler);

                    res.send(tmpl('index.html', {
                        flux : JSON.stringify(flux.toObject()),
                        html : React.renderToString(new Factory({
                            flux   : flux,
                            params : state.params,
                            query  : state.query
                        })),
                    }));
                }
            );
        }
    );
};
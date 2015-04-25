'use strict';

var React  = require('react');
var Router = require('react-router');

var config = require('./config');
var Flux   = require('./flux');
var routes = require('./routes');

var flux = new Flux();

var state = window.document.getElementById('server-state');

require('./ui/scss/app.scss');

if (__ENVIRONMENT__ !== 'production') {
    require('./ui/scss/style-guide.scss');
}

window.React = React;

React.initializeTouchEvents(true);

if (state) {
    flux = flux.fromObject(window.__STATE__);
    state.remove();
}

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    React.render(React.createElement(Handler, {
        flux   : flux,
        params : state.params,
        query  : state.query
    }), window.document.body);
});

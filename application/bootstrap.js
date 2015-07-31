'use strict';

var React  = require('react');
var Router = require('react-router');

var config = require('./config');
var Flux   = require('./flux');
var routes = require('./routes');

var flux = new Flux();

if (__ENVIRONMENT__ !== 'production') {
    require('./ui/scss/app.scss');
}

window.React = React;

React.initializeTouchEvents(true);

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    React.render(React.createElement(Handler, {
        flux   : flux,
        params : state.params,
        query  : state.query
    }), window.document.getElementById('app'));
});

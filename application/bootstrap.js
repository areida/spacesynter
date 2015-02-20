/* jshint globalstrict: true */
/* global window, __ENVIRONMENT__, io */
'use strict';

var React  = require('react');
var Router = require('react-router');

var config = require('./config');
var Flux   = require('./flux');
var routes = require('./routes');

var flux = new Flux();

var state = window.document.getElementById('server-state');

if (__SERVER__) {
    var socket = io('http://' + config.api.hostname + ':' + config.api.port);

    socket.on('connected', function () {
        window.console.log('socket.io connected');
    });

    socket.on('container', function (data) {
        window.console.log(data.message);
    });
}

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

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
    React.render(React.createElement(Handler, {flux : flux}), window.document.body);
});

'use strict';

import React  from 'react';
import Router from 'react-router';

import Flux   from './flux';
import routes from './routes';

let flux = new Flux();

require('./ui/scss/app.scss');

window.React = React;

React.initializeTouchEvents(true);

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    React.render(React.createElement(Handler, {
        flux   : flux,
        params : state.params,
        query  : state.query
    }), window.document.getElementById('app'));
});

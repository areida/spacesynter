/* jshint unused: false */
'use strict';

var React  = require('react');
var Route  = require('react-router').Route;

var config = require('./config');

var LoggedInLayout  = require('./ui/layouts/logged-in');
var LoggedOutLayout = require('./ui/layouts/logged-out');
var SiteLayout      = require('./ui/layouts/site');

var ContainersPage  = require('./ui/pages/containers');
var LoginPage       = require('./ui/pages/login');
var NotFoundPage    = require('./ui/pages/404');

var getEnvironmentDependentRoutes = function()
{
    var routes = [];

    if (__ENVIRONMENT__ !== 'production') {
        routes = routes.concat([]);
    }

    return routes;
};

module.exports = (
    <Route handler={SiteLayout}>
        <Route handler={LoggedInLayout}>
            <Route path='/' name='containers' handler={ContainersPage} />
        </Route>
        <Route handler={LoggedOutLayout}>
            {getEnvironmentDependentRoutes()}
            <Route path={config.login_url} name='login' handler={LoginPage} />
            <Route path='*' name='404' handler={NotFoundPage} />
        </Route>
    </Route>
);

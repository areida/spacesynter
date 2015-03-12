/* jshint unused: false */
'use strict';

var React  = require('react'); // Used in compiled js, so required even though appears unused
var Route  = require('react-router').Route;

var config = require('./config');

var LoggedInLayout  = require('./ui/layouts/logged-in');
var LoggedOutLayout = require('./ui/layouts/logged-out');
var SiteLayout      = require('./ui/layouts/site');

var ContainersPage  = require('./ui/pages/containers');
var LoginPage       = require('./ui/pages/login');
var NotFoundPage    = require('./ui/pages/404');
var StyleGuidePage  = require('./ui/pages/style-guide');

var getEnvironmentDependentRoutes = function()
{
    var routes = [];

    if (__ENVIRONMENT__ !== 'production') {
        routes = routes.concat([
            <Route path='/style-guide' name='style-guide' handler={StyleGuidePage} key='style-guide'/>,
            <Route path='/style-guide/:section' name='style-guide-section' handler={StyleGuidePage} key='style-guide-section'/>
        ]);
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
            <Route path={config.loginUri} name='login' handler={LoginPage} />
            <Route path='*' name='404' handler={NotFoundPage} />
        </Route>
    </Route>
);

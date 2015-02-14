/* jshint globalstrict: true, unused: false */
/* globals __ENVIRONMENT__ */
'use strict';

var React  = require('react'); // Used in compiled js, so required even though appears unused
var Route  = require('react-router').Route;

var SiteLayout       = require('./ui/layouts/site');
var HomePage         = require('./ui/pages/home');
var StyleGuidePage   = require('./ui/pages/style-guide');
var NotFoundPage     = require('./ui/pages/404');

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
        <Route path='/' name='home' handler={HomePage}/>
        {getEnvironmentDependentRoutes()}
        <Route path='*' name='404' handler={NotFoundPage}/>
    </Route>
);

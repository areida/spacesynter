/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var RouteHandler    = require('react-router').RouteHandler;
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;

module.exports = React.createClass({

    displayName : 'SiteLayout',

    mixins : [FluxMixin, new StoreWatchMixin('UserStore')],

    getStateFromFlux : function()
    {
        return {};
    },

    render : function() {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler />
            </div>
        );
    }
});

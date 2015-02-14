/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var RouteHandler    = require('react-router').RouteHandler;
var LoggedIn        = require('./header/user-logged-in.jsx');
var LoggedOut       = require('./header/user-logged-out.jsx');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;

module.exports = React.createClass({

    displayName : 'SiteLayout',

    mixins : [ FluxMixin, new StoreWatchMixin('TokenStore') ],

    getStateFromFlux : function()
    {
        var store = this.getFlux().store('TokenStore');

        return {
            loggedIn : store.isLoggedIn()
        };
    },

    render : function() {
        var Component = (this.state.loggedIn) ? LoggedIn : LoggedOut;
        return (
            <div className='l--app-wrapper'>
                <div className='l--user'>
                    <Component user={this.state.user} />
                </div>
                <RouteHandler />
            </div>
        );
    }
});

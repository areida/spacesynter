/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var Navigation      = require('react-router').Navigation;
var RouteHandler    = require('react-router').RouteHandler;
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;

module.exports = React.createClass({

    displayName : 'LoggedInLayout',

    mixins : [FluxMixin, Navigation, new StoreWatchMixin('TokenStore')],

    getStateFromFlux : function()
    {
        return {
            loggedIn : this.getFlux().store('TokenStore').isLoggedIn()
        };
    },

    componentDidMount : function()
    {
        this.authenticate();
    },

    componentDidUpdate : function()
    {
        this.authenticate();
    },

    authenticate : function()
    {
        if (! this.state.loggedIn) {
            //this.transitionTo('login');
        }
    },

    render : function() {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler />
            </div>
        );
    }
});

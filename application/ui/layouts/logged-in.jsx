/* jshint globalstrict: true, esnext: true */
'use strict';

var React           = require('react');
var Navigation      = require('react-router').Navigation;
var RouteHandler    = require('react-router').RouteHandler;
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;

module.exports = React.createClass({

    displayName : 'LoggedInLayout',

    mixins : [FluxMixin, Navigation, new StoreWatchMixin('TokenStore')],

    getStateFromFlux()
    {
        return {
            loggedIn : this.getFlux().store('TokenStore').isLoggedIn()
        };
    },

    componentDidMount()
    {
        this.authenticate();
    },

    componentDidUpdate()
    {
        this.authenticate();
    },

    authenticate()
    {
        if (! this.state.loggedIn) {
            //this.transitionTo('login');
        }
    },

    render()
    {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler />
            </div>
        );
    }
});

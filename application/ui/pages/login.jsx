/* jshint globalstrict: true, esnext: true */
'use strict';

var React           = require('react');
var Navigation      = require('react-router').Navigation;
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;

var Button = require('../components/buttons/button');

module.exports = React.createClass({
    displayName : 'Login',

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
        if (this.state.loggedIn) {
            this.transitionTo('/');
        }
    },

    render()
    {
        return (
            <div className='login'>
                <Button><a href='/gh-login'>Login with GitHub</a></Button>
            </div>
        );
    }
});

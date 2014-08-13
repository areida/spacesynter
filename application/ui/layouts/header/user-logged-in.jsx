/** @jsx React.DOM */
'use strict';

var React           = require('react');
var FluxChildMixin  = require('fluxxor').FluxChildMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;

module.exports = React.createClass({

    displayName : 'LoggedInHeaderSection',

    mixins : [FluxChildMixin, StoreWatchMixin('UserStore')],

    getStateFromFlux : function()
    {
        var userStore;

        userStore = this.getFlux().store('UserStore');

        return {
            loggedIn : !! userStore.data.email,
            email    : userStore.data.email
        };
    },

    render : function() {
        return (
            <div>
                <p>{'Logged in as '}<strong>{this.state.email}</strong>{'.'}</p>
                <p>
                    <a href='' onClick={this.getFlux().actions.logout}>{'Logout'}</a>
                </p>
            </div>
        );
    }
});

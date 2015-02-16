/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var Navigation      = require('react-router').Navigation;
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;

var Button    = require('../components/buttons/button');
var TextInput = require('../components/form/inputs/text');

module.exports = React.createClass({
    displayName : 'Home',

    mixins : [FluxMixin, Navigation, new StoreWatchMixin('TokenStore')],

    getInitialState : function()
    {
        return {
            username : ''
        };
    },

    getStateFromFlux : function()
    {
        return {
            loggedIn : this.getFlux().store('TokenStore').isLoggedIn()
        };
    },

    onChange : function(value)
    {
        this.setState({username : value});
    },

    onLogout : function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        if (this.state.loggedIn) {
            this.getFlux().actions.auth.logout();
        } else {
            this.getFlux().actions.auth.login();
        }
    },

    onSubmit : function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        if (this.state.username) {
            this.transitionTo('gists', {username : this.state.username});
        } else {
            this.transitionTo('all-gists');
        }
    },

    render : function() {
        return (
            <form method='get' action='/gists' onSubmit={this.onSubmit}>
                <h1 className='h1'>Github Gists</h1>
                <TextInput
                    id           = 'username'
                    type         = 'text'
                    initialValue = {this.state.username}
                    onChange     = {this.onChange}
                    placeholder  = 'Username' />
                <p>
                    <Button>
                        <button type='submit'>Fetch Gists</button>
                    </Button>
                    <Button>
                        <a href='/logout' onClick={this.onLogout}>Log Out</a>
                    </Button>
                </p>
            </form>
        );
    }
});

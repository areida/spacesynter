'use strict';

var store = require('store');

var ApiStore  = require('./api-store');
var constants = require('../constants');

class TokenStore extends ApiStore {
    constructor()
    {
        this.state = {
           error    : false,
           loading  : false,
           loggedIn : !! store.get('token'),
           token    : store.get('token')
        };

        super();

        this.bindActions(
            constants.LOGOUT, 'onLogout'
        );
    }

    onLogout()
    {
        store.remove('token');
        this.state.loggedIn = false;
        this.state.token    = {};

        this.emit('change');
    }

    getTokenData()
    {
        return store.get('token');
    }

    isLoggedIn()
    {
        return this.state.loggedIn;
    }

    setState(state)
    {
        this.state = state;

        if (this.state.token) {
            store.set('token', this.state.token);
        } else {
            store.remove('token');
        }
    }
}

module.exports = TokenStore;

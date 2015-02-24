/* jshint globalstrict: true , esnext: true*/
'use strict';

var constants       = require('../constants');
var APIStoreFactory = require('./api-store-factory');
var store           = require('store');

var TokenStore = APIStoreFactory.createStore({

    initialize()
    {
        this.state = {
           error    : false,
           loading  : false,
           loggedIn : !! store.get('token'),
           token    : store.get('token')
        };

        this.bindActions(
            constants.LOGOUT, 'onLogout'
        );
    },

    onLogout()
    {
        store.remove('token');
        this.state.loggedIn = false;
        this.state.token    = {};

        this.emit('change');
    },

    getTokenData()
    {
        return store.get('token');
    },

    isLoggedIn()
    {
        return this.state.loggedIn;
    },

    setState(state)
    {
        this.state = state;

        if (this.state.token) {
            store.set('token', this.state.token);
        } else {
            store.remove('token');
        }
    }
});

module.exports = TokenStore;

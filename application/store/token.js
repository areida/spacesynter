/* jshint globalstrict: true */
'use strict';

var constants       = require('../constants');
var APIStoreFactory = require('./api-store-factory');
var store           = require('store');

var TokenStore = APIStoreFactory.createStore({

    initialize : function()
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

    onLogout : function()
    {
        store.remove('token');
        this.state.loggedIn = false;
        this.state.token    = {};

        this.emit('change');
    },

    getTokenData : function()
    {
        return store.get('token');
    },

    isLoggedIn : function()
    {
        return this.state.loggedIn;
    },

    setState : function(state)
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

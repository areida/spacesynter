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
            constants.LOGGING_IN, 'onLogin',
            constants.LOGIN_SUCCESSFUL, 'onLoginSuccessful',
            constants.LOGIN_FAILED, 'onLoginFailed',
            constants.LOGOUT, 'onLogout'
        );
    },

    onLogin : function()
    {
        this.state.loaded  = false;
        this.state.loading = true;

        this.emit('change');
    },

    onLoginSuccessful : function(payload)
    {
        this.state.loaded   = true;
        this.state.loading  = false;
        this.state.loggedIn = true;
        this.state.token    = payload.tokenData;

        store.set('token', this.state.token);

        this.emit('change');
    },

    onLoginFailed : function()
    {
        this.state.loading = false;
        this.state.error   = true;

        this.emit('change');
    },

    onLogout : function()
    {
        store.remove('token');
        this.state.loggedIn = false;

        this.emit('change');
    },

    getTokenData : function()
    {
        return store.get('token');
    },

    isLoggedIn : function()
    {
        return this.state.loggedIn;
    }
});

module.exports = TokenStore;

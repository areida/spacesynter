/* jshint globalstrict: true */
/* global error, console */
'use strict';

var APIStoreFactory = require('./api-store-factory');
var constants       = require('../constants');

var GithubStore = APIStoreFactory.createStore({
    initialize : function()
    {
        this.state = {
            loaded    : false,
            loading   : false,
            gists     : [],
            rateLimit : {
                limit     : 0,
                remaining : 0,
                reset     : 0
            }
        };

        this.bindActions(
            constants.CLEAR_GISTS, 'onClearGists',
            constants.GET_RATE_LIMIT_SUCCESS, 'onGetRateLimitSuccess',
            constants.GET_USERS_GISTS, 'onGetUsersGists',
            constants.GET_USERS_GISTS_FAILURE, 'onGetUsersGistsFailure',
            constants.GET_USERS_GISTS_SUCCESS, 'onGetUsersGistsSuccess'
        );
    },

    onClearGists : function()
    {
        this.state.error   = false;
        this.state.gists   = [];
        this.state.loaded  = false;
        this.state.loading = false;

        this.emit('change');
    },

    onGetRateLimitSuccess : function(response)
    {
        this.state.loaded    = false;
        this.state.loading   = true;
        this.state.rateLimit = response.rate;

        this.emit('change');
    },

    onGetUsersGists : function()
    {
        this.state.error   = false;
        this.state.gists   = [];
        this.state.loaded  = false;
        this.state.loading = true;

        this.emit('change');
    },

    onGetUsersGistsFailure : function(error)
    {
        this.state.error   = true;
        this.state.gists   = [];
        this.state.loaded  = false;
        this.state.loading = false;

        this.emit('change');
    },

    onGetUsersGistsSuccess : function(response)
    {
        this.state.error   = false;
        this.state.gists   = response;
        this.state.loaded  = true;
        this.state.loading = false;

        this.emit('change');
    },

    getError : function()
    {
        return this.state.error;
    },

    getGists : function()
    {
        return this.state.gists;
    }
});

module.exports = GithubStore;
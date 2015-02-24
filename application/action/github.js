'use strict';

var githubClient = require('../client/github');
var constants    = require('../constants');

module.exports = {
    clearGists : function()
    {
        this.dispatch(constants.CLEAR_GISTS);
    },

    fetchBranches : function()
    {},

    fetchPulls : function()
    {},

    getUsersGists : function(username)
    {
        var flux = this;

        flux.dispatch(constants.GET_USERS_GISTS);

        return githubClient.getUsersGists(username)
            .then(
                function (response) {
                    flux.dispatch(constants.GET_USERS_GISTS_SUCCESS, response);
                },
                function (error) {
                    flux.dispatch(constants.GET_USERS_GISTS_FAILURE, error);
                }
            );
    },

    reset : function()
    {}
};



/* jshint globalstrict: true */
'use strict';

var constants    = require('../constants');
var githubClient = require('../client/github');

module.exports = {
    clearGists : function()
    {
        this.dispatch(constants.CLEAR_GISTS);
    },

    getRateLimit : function()
    {
        var flux = this;

        flux.dispatch(constants.GET_RATE_LIMIT);

        return githubClient.getRateLimit()
            .then(
                function (response) {
                    flux.dispatch(constants.GET_RATE_LIMIT_SUCCESS, response);
                },
                function () {
                    flux.dispatch(constants.GET_RATE_LIMIT_FAILURE);
                }
            );
    },

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
    }
};



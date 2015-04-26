'use strict';

var githubClient = require('../client/github');
var constants    = require('../constants');

module.exports = {
    clearGists()
    {
        this.dispatch(constants.CLEAR_GISTS);
    },

    fetchBranches()
    {},

    fetchPulls()
    {},

    getUsersGists(username)
    {
        let flux = this;

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



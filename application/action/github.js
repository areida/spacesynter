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
        this.dispatch(constants.GET_USERS_GISTS);

        return githubClient.getUsersGists(username)
            .then(
                response => this.dispatch(constants.GET_USERS_GISTS_SUCCESS, response),
                error => this.dispatch(constants.GET_USERS_GISTS_FAILURE, error)
            );
    }
};



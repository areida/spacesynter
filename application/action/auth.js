'use strict';

var authClient = require('../client/auth');
var constants  = require('../constants');

module.exports = {
    login(path)
    {
        if (typeof window !== 'undefined') {
            window.location.href = window.location.origin + '/gh-login' + (path ? '?returnPath=' + path : '');
        }
    },

    logout()
    {
        this.dispatch(constants.LOGOUT);

        return authClient.logout();
    }
};

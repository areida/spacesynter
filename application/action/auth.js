/* jshint globalstrict: true */
/* global window */
'use strict';

var authClient = require('../client/auth');
var constants  = require('../constants');

module.exports = {
    login : function(path)
    {
        if (typeof window !== 'undefined') {
            window.location.href = window.location.origin + '/gh-login' + (path ? '?returnPath=' + path : '');
        }
    },

    logout : function()
    {
        this.dispatch(constants.LOGOUT);

        return authClient.logout();
    }
};

'use strict';

var authenticationActions = require('./actions/authentication');
var constants = require('./constants');

module.exports = {
    login : authenticationActions.login,
    logout : authenticationActions.logout,
    navigate : function(route, params, query) {
        this.dispatch(constants.NAVIGATE, arguments);
    },
    forward : function(route, params, query) {
        this.dispatch(constants.FORWARD, arguments);
    }
};

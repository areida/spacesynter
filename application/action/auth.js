/* jshint globalstrict: true */
'use strict';

var constants   = require('../constants');
var oauthClient = require('../client/oauth');
var userClient  = require('../client/user');

var loginCreatedUser = function(password, userData) {
    var flux = this;

    // User created, now log in
    return oauthClient.login(userData.email, password)
        .then(function (tokenData) {
            flux.dispatch(
                constants.LOGIN_SUCCESSFUL,
                {
                    tokenData : tokenData,
                    userData  : userData
                }
            );
        }, function () {
            flux.dispatch(constants.LOGIN_FAILED);
        });
};

var fetchLoggedInUser = function(tokenData)
{
    var flux = this;

    // Authenticated, but still need user data
    userClient.setToken(tokenData);
    return userClient.getCurrentUser()
        .then(function (userData) {
            flux.dispatch(
                constants.LOGIN_SUCCESSFUL,
                {
                    tokenData : tokenData,
                    userData  : userData
                }
            );
        }, function () {
            flux.dispatch(constants.LOGIN_FAILED);
        });
};

module.exports = {
    login : function(username, password)
    {
        var flux = this;

        flux.dispatch(constants.LOGGING_IN);

        return oauthClient.login(username, password)
            .then(
                fetchLoggedInUser.bind(flux),
                function() {
                    flux.dispatch(constants.LOGIN_FAILED);
                }
            );
    },

    logout : function()
    {
        // Assume the logout worked, since it doesn't make a difference to the user
        oauthClient.logout();

        this.dispatch(constants.LOGOUT);
    },

    registerUser : function(email, password) {
        var flux = this;

        this.dispatch(constants.REGISTERING);

        return userClient.createUser({
                email    : email,
                password : password
            })
            .then(
                loginCreatedUser.bind(flux, password),
                function() {
                    flux.dispatch(constants.REGISTRATION_FAILED);
                }
            );
    }
};

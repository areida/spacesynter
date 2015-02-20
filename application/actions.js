/* jshint globalstrict: true */
'use strict';

var authActions      = require('./action/auth');
var containerActions = require('./action/container');
var githubActions    = require('./action/github');

module.exports = {
    auth      : authActions,
    container : containerActions,
    github    : githubActions
};

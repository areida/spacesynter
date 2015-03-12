'use strict';

var authActions      = require('./action/auth');
var buildActions     = require('./action/build');
var containerActions = require('./action/container');
var githubActions    = require('./action/github');

module.exports = {
    auth      : authActions,
    build     : buildActions,
    container : containerActions,
    github    : githubActions
};

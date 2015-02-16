/* jshint globalstrict: true */
'use strict';

var authActions     = require('./action/auth');
var instanceActions = require('./action/instance');
var projectActions  = require('./action/project');
var githubActions   = require('./action/github');

module.exports = {
    auth     : authActions,
    instance : instanceActions,
    project  : projectActions,
    github   : githubActions
};

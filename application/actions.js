/* jshint globalstrict: true */
'use strict';

var authActions   = require('./action/auth');
var githubActions = require('./action/github');

module.exports = {
    auth   : authActions,
    github : githubActions
};

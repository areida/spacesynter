/* jshint globalstrict: true */
'use strict';

var GithubStore   = require('./store/github');
var InstanceStore = require('./store/instance');
var ProjectStore  = require('./store/project');
var TokenStore    = require('./store/token');

module.exports = {
    GithubStore   : GithubStore,
    InstanceStore : InstanceStore,
    ProjectStore  : ProjectStore,
    TokenStore    : TokenStore
};

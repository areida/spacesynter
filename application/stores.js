/* jshint globalstrict: true */
'use strict';

var GithubStore    = require('./store/github');
var ContainerStore = require('./store/container');
var TokenStore     = require('./store/token');

module.exports = {
    GithubStore    : GithubStore,
    ContainerStore : ContainerStore,
    TokenStore     : TokenStore
};

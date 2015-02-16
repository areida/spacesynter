/* jshint globalstrict: true */
'use strict';

var GithubStore = require('./store/github');
var TokenStore  = require('./store/token');

module.exports = {
    GithubStore : GithubStore,
    TokenStore  : TokenStore
};

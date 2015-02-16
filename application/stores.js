/* jshint globalstrict: true */
'use strict';

var GithubStore = require('./store/github');
var TokenStore  = require('./store/token');

module.exports = {
    GithubStore : new GithubStore(),
    TokenStore  : new TokenStore()
};

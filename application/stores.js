/* jshint globalstrict: true */
'use strict';

var GithubStore = require('./store/github');
var TokenStore = require('./store/token');
var UserStore  = require('./store/user');

module.exports = {
    GithubStore : new GithubStore(),
    TokenStore  : new TokenStore(),
    UserStore   : new UserStore()
};

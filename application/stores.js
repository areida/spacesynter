'use strict';

var ContainerStore = require('./store/container');
var TokenStore     = require('./store/token');

module.exports = {
    ContainerStore : new ContainerStore(),
    TokenStore     : new TokenStore()
};

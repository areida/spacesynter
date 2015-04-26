'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');
var store       = require('store');

var config = require('../config').api;

class AuthClient extends AuthGateway {
    constructor()
    {
        this.config = config;
        super();
    }

    logout()
    {
        return this.apiRequest('GET', '/logout');
    }
}

module.exports = new AuthClient();

'use strict';

var HttpGateway = require('synapse-common/http/gateway');
var store       = require('store');

var config = require('../config').api;

class AuthClient extends HttpGateway {
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

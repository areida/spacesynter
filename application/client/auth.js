/* jshint globalstrict: true, esnext: true */
'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');
var store       = require('store');

var config = require('../config');

var AuthClient = AuthGateway.extend({

    config : config.api,

    logout()
    {
        return this.apiRequest('GET', '/logout');
    }

});

module.exports = new AuthClient();
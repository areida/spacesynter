/* jshint globalstrict: true */
'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');

var config = require('../config');

var AuthClient = AuthGateway.extend({

    config : config.api,

    create : function(name)
    {
        return this.apiRequest('POST', '/db/instance/', {name : name});
    },

    destroy : function(key)
    {
        return this.apiRequest('DELETE', '/db/instance/' + key);
    },

    fetch : function(key)
    {
        return this.apiRequest('GET', '/db/instance/' + key);
    },

    fetchAll : function()
    {
        return this.apiRequest('GET', '/db/instances');
    }

});

module.exports = new AuthClient();
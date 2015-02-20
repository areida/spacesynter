/* jshint globalstrict: true */
'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');

var config = require('../config');

var AuthClient = AuthGateway.extend({

    config : config.api,

    create : function(container)
    {
        return this.apiRequest('POST', '/container/', {name : container.name});
    },

    fetch : function(name)
    {
        return this.apiRequest('GET', '/container/' + name);
    },

    fetchAll : function()
    {
        return this.apiRequest('GET', '/containers');
    },

    kill : function(name)
    {
        return this.apiRequest('DELETE', '/container/' + name);
    }
});

module.exports = new AuthClient();

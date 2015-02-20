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

    destroy : function(key)
    {
        return this.apiRequest('DELETE', '/container/' + key);
    },

    fetch : function(key)
    {
        return this.apiRequest('GET', '/container/' + key);
    },

    fetchAll : function()
    {
        return this.apiRequest('GET', '/containers');
    }

});

module.exports = new AuthClient();
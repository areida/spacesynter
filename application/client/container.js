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

    destroy : function(container)
    {
        return this.apiRequest('DELETE', '/container/' + container.name);
    },

    fetch : function(container)
    {
        return this.apiRequest('GET', '/container/' + container.name);
    },

    fetchAll : function()
    {
        return this.apiRequest('GET', '/containers');
    }

});

module.exports = new AuthClient();
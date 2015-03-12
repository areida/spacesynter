'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');

var config = require('../config');

var ContainerClient = AuthGateway.extend({

    config : config.api,

    create(container)
    {
        return this.apiRequest('POST', '/container/', {name : container.name});
    },

    fetch(name)
    {
        return this.apiRequest('GET', '/container/' + name);
    },

    fetchAll()
    {
        return this.apiRequest('GET', '/containers');
    },

    kill(name)
    {
        return this.apiRequest('DELETE', '/container/' + name);
    }
});

module.exports = new ContainerClient();

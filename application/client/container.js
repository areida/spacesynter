'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');

var config = require('../config').api;

class ContainerClient extends AuthGateway {
    constructor()
    {
        this.config = config;
        super();
    }

    activateBuild(name, build)
    {
        return this.apiRequest('PATCH', '/container/' + name, {build : build});
    }

    create(name, path, type)
    {
        return this.apiRequest('POST', '/container/', {
            name : name,
            path : path,
            type : type
        });
    }

    deleteBuild(name, build)
    {
        return this.apiRequest('DELETE', '/container/' + name + '/build/' + build);
    }

    fetch(name)
    {
        return this.apiRequest('GET', '/container/' + name);
    }

    fetchAll()
    {
        return this.apiRequest('GET', '/containers');
    }

    kill(name)
    {
        return this.apiRequest('DELETE', '/container/' + name);
    }
}

module.exports = new ContainerClient();

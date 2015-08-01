'use strict';

import HttpGateway from 'synapse-common/http/gateway';

import {api} from '../../config';

export default class ContainerClient extends HttpGateway {
    constructor()
    {
        super();
        this.config = api;
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

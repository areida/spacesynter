'use strict';

import HttpGateway from 'synapse-common/http/gateway';

import {api} from '../../config';

export default class ContainerClient extends HttpGateway {
    constructor()
    {
        super();
        this.config = api;
    }

    create(name, path, type, backend)
    {
        return this.apiRequest('POST', '/container', {backend, name, path, type});
    }

    fetch(name)
    {
        return this.apiRequest('GET', `/container/${name}`);
    }

    fetchAll()
    {
        return this.apiRequest('GET', '/containers');
    }

    kill(name)
    {
        return this.apiRequest('DELETE', `/container/${name}`);
    }
}

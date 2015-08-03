/* global File */
'use strict';

import HttpGateway from 'synapse-common/http/gateway';

import {api} from '../../config';

export default class BuildClient extends HttpGateway {
    constructor()
    {
        super();
        this.config = api;
    }

    activate(name, build)
    {
        return this.apiRequest('PATCH', '/container/' + name + '/build/' + build);
    }

    create(container, file)
    {
        return this.apiRequest('POST', '/container/' + container.get('name') + '/build', file);
    }

    delete(name, build)
    {
        return this.apiRequest('DELETE', '/container/' + name + '/build/' + build);
    }

    getRequestOptions(method, path, data)
    {
        let options = super.getRequestOptions(method, path, data);

        if (data instanceof File) {
            options.headers['X-Filename'] = data.name.replace(/\s/g, '-').toLowerCase();
        }

        return options;
    }
}
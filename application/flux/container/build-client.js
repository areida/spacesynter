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
        return this.apiRequest('POST',  `/container/${name}/build/${build}/activate`);
    }

    create(container, file)
    {
        return this.apiRequest('POST',  `/container/${container}/build`, file);
    }

    deactivate(name, build)
    {
        return this.apiRequest('POST',  `/container/${name}/build/${build}/deactivate`);
    }

    delete(container, build)
    {
        return this.apiRequest('DELETE',    `/container/${container}/build/${build}`);
    }

    update(container, build, name)
    {
        return this.apiRequest('PATCH',     `/container/${container}/build/${build}`, {name});
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
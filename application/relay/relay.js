'use strict';

import HttpGateway from 'synapse-common/http/gateway';

import {api} from '../../config';

export default class ContainerClient extends HttpGateway {
    constructor()
    {
        super();
        this.config = api;
    }

    query(query)
    {
        return this.apiRequest('get', '/graphql', {
            q : query
        });
    }
}

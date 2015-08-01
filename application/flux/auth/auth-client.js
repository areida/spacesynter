'use strict';

import HttpGateway from 'synapse-common/http/gateway';

import {api} from '../../config';

export default class AuthClient extends HttpGateway {
    constructor()
    {
        super();
        this.config = api;
    }

    logout()
    {
        return this.apiRequest('GET', '/logout');
    }
}

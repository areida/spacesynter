'use strict';

import HttpGateway from 'synapse-common/http/gateway';

import config from '../config';

class AuthClient extends HttpGateway {
    constructor()
    {
        super();
        this.config = config.api;
    }

    logout()
    {
        return this.apiRequest('GET', '/logout');
    }
}

export default new AuthClient();

'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');
var store       = require('store');

var config = require('../config').github;

class GithubClient extends AuthGateway {
    constructor()
    {
        this.config = config;
        super();
    }

    getRateLimit()
    {
        return this.apiRequest('GET', '/rate_limit');
    }

    getUsersGists(username)
    {
        if (username) {
            return this.apiRequest('GET', '/users/' + username + '/gists');
        } else {
            return this.apiRequest('GET', '/gists');
        }
    }

    getRequestOptions(method, path, data)
    {
        var config, headers, queryString, token;

        config = this.getConfig();

        if (data && method === 'GET') {
            queryString = this.toQuery(data);

            if (queryString) {
                path = path + '?' + queryString;
            }
        }

        headers = {
            'Accept'       : 'application/json',
            'Content-Type' : 'application/json'
        };

        if (typeof window === 'undefined') {
            headers['User-Agent'] = config.userAgent;
        }

        token = store.get('token');

        if (token) {
            headers.Authorization = 'token ' + token.access_token;
        }

        return {
            hostname        : config.hostname,
            port            : config.port,
            method          : method,
            path            : path,
            withCredentials : (config.withCredentials === true),
            headers         : headers
        };
    }
}

module.exports = new GithubClient();

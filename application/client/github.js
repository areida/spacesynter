/* jshint globalstrict: true */
'use strict';

var AuthGateway = require('synapse-common/http/auth-gateway');
var store       = require('store');

var config      = require('../config');

var GithubClient = AuthGateway.extend({

    config : config.github,

    state : null,

    getRateLimit : function()
    {
        return this.apiRequest('GET', '/rate_limit');
    },

    getUsersGists : function(username)
    {
        if (username) {
            return this.apiRequest('GET', '/users/' + username + '/gists');
        } else {
            return this.apiRequest('GET', '/gists');
        }
    },

    getRequestOptions : function(method, path, data)
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
            headers['User-Agent:'] = config.userAgent;
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
});

module.exports = new GithubClient();
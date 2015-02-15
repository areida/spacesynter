/* jshint globalstrict: true */
'use strict';

var config      = require('../config');
var AuthGateway = require('synapse-common/http/auth-gateway');
var store       = require('store');

var GithubClient = AuthGateway.extend({

    config : config.github,

    getRateLimit : function()
    {
        return this.apiRequest('GET', '/rate_limit');
    },

    getUsersGists : function(username)
    {
        return this.apiRequest('GET', '/users/' + username + '/gists');
    },

    getRequestOptions : function(method, path, data)
    {
        var config, headers, queryString;

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
            headers['User-Agent:'] = 'areida/frontend-template';
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
'use strict';

var crypto    = require('crypto');
var Express   = require('express');
var HttpError = require('synapse-common/http/error');
var Q         = require('q');
var qs        = require('querystring');
var request   = require('request');
var url       = require('url');
var _         = require('lodash');

var config = require('../config');

var options = {
    baseUrl        : 'http://' + config.frontend.host,
    callbackUri    : '/gh-callback',
    ghClientId     : config.github.clientId,
    ghClientSecret : config.github.clientSecret,
    ghLoginUrl     : 'https://github.com/login',
    scope          : 'gist'
};

var github = new Express();

function createState() {
    return crypto.randomBytes(8).toString('hex');
}

function authorizeUrl(state) {
    var query = {
        client_id    : options.ghClientId,
        redirect_uri : url.resolve(options.baseUrl, options.callbackUri),
        state        : state
    };

    if (options.scope) {
        query.scope = options.scope;
    }

    query = qs.stringify(query);

    return (options.ghLoginUrl + '/oauth/authorize?' + query);
}

function makeRequest(query) {
    return new Q.Promise(
        function (resolve, reject) {
            request(
                {
                    url  : options.ghLoginUrl + '/oauth/access_token',
                    qs   : query,
                    json : true
                },
                function (error, response, token) {
                    if (error) {
                        reject(new HttpError(token, response));
                    } else {
                        resolve(token);
                    }
                }
            );
        }
    );
}

github.get('/gh-login/?', function (req, res) {
    req.session.ghState = createState();

    res.redirect(302, authorizeUrl(req.session.state));
    res.end();
});

github.get('/gh-callback/?', function (req, res) {
    if (! req.query.code || ! req.session.ghState) {
        res.redirect(302, '/login');
        res.end();
    } else {
        var query = {
            client_id     : options.ghClientId,
            client_secret : options.ghClientSecret,
            code          : req.query.code,
            state         : req.session.state
        };

        makeRequest(query)
            .then(
                function (token) {
                    var redirectUrl = req.session.redirectUrl || '/';
                    req.session.ghState     = null;
                    req.session.ghToken     = token;
                    req.session.redirectUrl = null;
                    res.redirect(302, redirectUrl);
                    res.end();
                },
                function (error) {
                    console.error('There was a login error', error);
                    res.redirect(403, '/');
                    res.end();
                }
            )
            .done();
    }
});

module.exports = github;

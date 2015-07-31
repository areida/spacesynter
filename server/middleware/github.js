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
    callbackUri    : 'http://' + config.frontend.host + '/gh-callback',
    ghClientId     : config.github.clientId,
    ghClientSecret : config.github.clientSecret,
    ghLoginUrl     : 'https://github.com/login',
    scope          : 'read:org'
};

var github = new Express();

function createState() {
    return crypto.randomBytes(8).toString('hex');
}

function authorizeUrl(state) {
    var query = {
        client_id    : options.ghClientId,
        redirect_uri : options.callbackUri,
        state        : state
    };

    if (options.scope) {
        query.scope = options.scope;
    }

    query = qs.stringify(query);

    return (options.ghLoginUrl + '/oauth/authorize?' + query);
}

function makeRequest(url, query, token) {
    return new Q.Promise(
        function (resolve, reject) {
            var options = {
                url     : url,
                qs      : query,
                json    : true,
                headers : {
                    'User-Agent' : config.github.userAgent
                }
            };

            if (token) {
                options.headers.Authorization = 'token ' + token.access_token;
            }

            request(
                options,
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

        var url = options.ghLoginUrl + '/oauth/access_token';

        makeRequest(url ,query).done(
            function (token) {
                var redirectUrl     = req.session.redirectUrl || '/';
                req.session.ghState = null;

                var finish = function () {
                    req.session.ghToken     = token;
                    req.session.redirectUrl = null;
                    res.redirect(302, redirectUrl);
                };

                if (config.github.organizations.length) {
                    makeRequest('https://api.github.com/user/orgs', {}, token).done(
                        function (orgs) {
                            if (
                                _.intersection(
                                    config.github.organizations,
                                    _.pluck(orgs, 'login')
                                ).length
                            ) {
                                finish();
                            } else {
                                res.redirect(403, '/');
                            }
                        },
                        function (error) {
                            res.status(500);
                            res.json(error);
                        }
                    );
                } else {
                    finish();
                }
            },
            function (error) {
                res.redirect(403, '/');
            }
        );
    }
});

module.exports = github;

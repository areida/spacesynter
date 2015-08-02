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

function finishLogin(req, res, token, redirectUrl) {
    req.session.ghToken = token;
    res.redirect(redirectUrl);
}

function handleError(error) {
    res.status(500);
    res.json(error);
}

function makeApiRequest(url, query, token) {
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
                function (error, response, body) {
                    if (error) {
                        reject(new HttpError(body, response));
                    } else {
                        resolve(body);
                    }
                }
            );
        }
    );
}

github.get('/gh-login/?', function (req, res) {
    req.session.ghState = createState();

    res.redirect(authorizeUrl(req.session.state));
    res.end();
});

github.get('/gh-callback/?', function (req, res) {
    if (! req.query.code || ! req.session.ghState) {
        res.redirect('/login');
        res.end();
    } else {
        var query = {
            client_id     : options.ghClientId,
            client_secret : options.ghClientSecret,
            code          : req.query.code,
            state         : req.session.state
        };

        var url = options.ghLoginUrl + '/oauth/access_token';

        makeApiRequest(url, query).done(
            function (token) {
                var redirectUrl         = req.session.redirectUrl || '/';
                req.session.ghState     = null;
                req.session.redirectUrl = null;

                if (config.github.organization) {
                    makeApiRequest('https://api.github.com/user/orgs', {}, token).done(
                        function (orgs) {
                            if (
                                _.includes(
                                    _.pluck(orgs, 'login'),
                                    config.github.organization
                                )
                            ) {
                                finishLogin(req, res, token, redirectUrl);
                            } else {
                                res.redirect(redirectUrl);
                            }
                        },
                        handleError
                    );
                } else {
                    finishLogin(req, res, token, redirectUrl);
                }
            },
            handleError
        );
    }
});

module.exports = github;

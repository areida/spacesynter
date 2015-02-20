var crypto    = require('crypto');
var HttpError = require('synapse-common/http/error');
var Q         = require('q');
var qs        = require('querystring');
var request   = require('request');
var url       = require('url');
var _         = require('underscore');

var config = require('../application/config');

var options = {
    ghClientId     : process.env.GH_CLIENT_ID,
    ghClientSecret : process.env.GH_CLIENT_SECRET,
    ghLoginUrl     : 'https://github.com/login',
    baseUrl        : process.env.GH_BASE_URL || 'http://' + (config.app.hostname + ':' + config.app.port),
    callbackUri    : '/gh-callback',
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

function callback(code, state) {
    var query = {
        client_id     : options.ghClientId,
        client_secret : options.ghClientSecret,
        code          : code,
        state         : state
    };

    return new Q.Promise(function (resolve, reject) {
        request({
            url  : options.ghLoginUrl + '/oauth/access_token',
            qs   : query,
            json : true
        }, function (error, response, token) {
            if (error) {
                reject(new HttpError(token, response));
            } else {
                resolve(token);
            }
        });
    });
}

github.get('/gh-login/?', function (req, res) {
    req.session.ghState = ghClient.createState();

    res.redirect(302, ghClient.authorizeUrl(req.session.state));
    res.end();
});

github.get('/gh-callback/?', function (req, res) {
    if (! req.query.code || ! req.session.ghState) {
        res.redirect(302, config.app.loginUri);
        res.end();
    } else {
        ghClient.callback(req.query.code, req.session.state)
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
                    console.error('there was a login error', error);
                    res.redirect(403, '/');
                    res.end();
                }
            )
            .done();
    }
});

github.get('/logout/?', function (req, res) {
    req.session.ghToken = null;

    if (req.headers['content-type'] === 'application/json') {
        res.end();
    } else {
        res.redirect(302, config.app.loginUri);
        res.end(); 
    }
});

module.exports = github;

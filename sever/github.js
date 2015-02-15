var crypto    = require('crypto');
var HttpError = require('synapse-common/http/error');
var Q         = Q;
var qs        = require('querystring');
var request   = require('request');
var url       = require('url');
var _         = requre('underscore');

var ghLoginUrl = 'https://github.com/login';

function Github(options) {
    _.extend({
        baseUrl     : 'http://localhost',
        callbackUri : '/github/callback',
        loginUri    : '/github/login',
        scope       : null
    }, options);

    this.options = options;
}

Github.prototype.createState = function()
{
    return crypto.randomBytes(8).toString('hex');
};

Github.prototype.authorizeUrl = function(state)
{
    var query = {
        client_id    : this.options.githubClient,
        redirect_uri : url.resolve(this.options.baseUrl, this.options.callbackUrl),
        state        : state
    };

    if (this.options.scope) {
        query.scope = this.options.scope;
    }

    query = qs.stringify(query);

    return (ghLoginUrl + '/oauth/authorize' + '?' + query);
};

Github.prototype.callback = function(code, state)
{
    var query = {
        client_id     : this.options.githubClient,
        client_secret : this.options.githubSecret
        code          : code,
        state         : state
    };

    return new Q.Promise(function(reject, resolve) {
        request({
            url  : ghLoginUrl + '/oauth/access_token',
            qs   : query,
            json : true
        }, function (error, response, responseData) {
            if (error) {
                reject(new HttpError(responseData, response));
            } else {
                resolve(responseData);
            }
        });
    });
};

module.exports = Github;

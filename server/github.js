var crypto    = require('crypto');
var HttpError = require('synapse-common/http/error');
var Q         = require('q');
var qs        = require('querystring');
var request   = require('request');
var url       = require('url');
var _         = require('underscore');

var ghLoginUrl = 'https://github.com/login';

function Github(options) {
    _.extend({
        baseUrl     : 'http://localhost',
        callbackUri : '/github/callback',
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
        client_id    : this.options.ghClientId,
        redirect_uri : url.resolve(this.options.baseUrl, this.options.callbackUri),
        state        : state
    };

    if (this.options.scope) {
        query.scope = this.options.scope;
    }

    query = qs.stringify(query);

    return (ghLoginUrl + '/oauth/authorize?' + query);
};

Github.prototype.callback = function(code, state)
{
    var query = {
        client_id     : this.options.ghClientId,
        client_secret : this.options.ghClientSecret,
        code          : code,
        state         : state
    };

    return new Q.Promise(function (resolve, reject) {
        request({
            url  : ghLoginUrl + '/oauth/access_token',
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
};

module.exports = Github;

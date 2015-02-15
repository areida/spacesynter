var crypto  = require('crypto')
var path    = require('path')
var url     = require('url')

module.exports = function(opts) {
    if (!opts.callbackURI) opts.callbackURI = '/github/callback';

    if (!opts.loginURI) opts.loginURI = '/github/login';

    if (typeof opts.scope === 'undefined') opts.scope = 'user';

    var state = crypto.randomBytes(8).toString('hex');

    var urlObj = url.parse(opts.baseURL);

    urlObj.pathname = path.join(urlObj.pathname, opts.callbackURI);

    var redirectURI = url.format(urlObj);
    var emitter = new events.EventEmitter();
  
    function login(req, resp) {
        var u = 'https://github.com/login/oauth/authorize'
            + '?client_id=' + opts.githubClient
            + (opts.scope ? '&scope=' + opts.scope : '')
            + '&redirect_uri=' + redirectURI
            + '&state=' + state;

        resp.statusCode = 302;
        resp.setHeader('location', u);
        resp.end();
    }

    function callback(req, resp, cb) {
        var query = url.parse(req.url, true).query;
        var code  = query.code;

        if (!code) return emitter.emit('error', {error: 'missing oauth code'}, resp)

        var u = 'https://github.com/login/oauth/access_token'
            + '?client_id=' + opts.githubClient
            + '&client_secret=' + opts.githubSecret
            + '&code=' + code
            + '&state=' + state;

        request.get({url:u, json: true}, function (err, tokenResp, body) {
            if (err) {
                if (cb) {
                    err.body = body;
                    err.tokenResp = tokenResp;
                    return cb(err);
                }
                return emitter.emit('error', body, err, resp, tokenResp, req);
            }
            if (cb) {
                cb(null, body);
            }
            emitter.emit('token', body, resp, tokenResp, req);
        });
    }

    return emitter
}

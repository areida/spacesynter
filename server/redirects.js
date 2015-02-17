module.exports = function(req, res, next) {
    if (req.url === '/gists' && req.params.username) {
        res.redirect(302, req.url + '/' + req.params.username);
        res.end();
    } else {
        next();
    }
};
/* jshint globalstrict: true */
/* global __BACKEND__ */
'use strict';

var backend;

backend = __BACKEND__ || '%DEV_API_HOST%';

module.exports = {
    api : {
        hostname : 'localhost',
        port     : 9000
    },
    github : {
        hostname  : 'api.github.com',
        port      : 443,
        secure    : true,
        userAgent : 'areida/frontend-template'
    },
    server : {
        hostname : 'localhost',
        port     : 9000
    },
    devServer : {
        hostname : 'localhost',
        port     : 9090
    }
};

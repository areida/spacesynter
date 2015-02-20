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
    devServer : {
        hostname : 'localhost',
        port     : 9090
    },
    github : {
        hostname  : 'api.github.com',
        port      : 443,
        secure    : true,
        userAgent : 'areida/spacesynter'
    },
    redis : {
        hostname : 'localhost',
        port     : 6379,
        database : 3
    },
    server : {
        hostname : 'localhost',
        port     : 9000
    }
};

/* jshint globalstrict: true */
/* global __BACKEND__ */
'use strict';

var backend;

backend = __BACKEND__ || '%DEV_API_HOST%';

module.exports = {
    api : {
        auth     : false,
        docker   : false,
        hostname : 'localhost',
        nginx    : false,
        port     : 8000
    },
    app : {
        auth     : false,
        hostname : 'localhost',
        loginUri : '/login',
        port     : 9000
    },
    devServer : {
        hostname : 'localhost',
        port     : 9000
    },
    github : {
        hostname  : 'api.github.com',
        port      : 443,
        secure    : true,
        userAgent : 'areida/spacesynter'
    },
    redis : {
        containers : {
            host     : 'localhost',
            port     : 6379,
            database : 4
        },
        cookies : {
            host     : 'localhost',
            port     : 6379,
            database : 5,
            secret   : 'abcdefghijklmnopqrstuvwxyz1234567890'
        }
    }
};

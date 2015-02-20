/* jshint globalstrict: true */
'use strict';

module.exports = {
    api : {
        auth     : false,
        docker   : true,
        hostname : 'api.spacesynter.com',
        nginx    : true,
        port     : 80
    },
    server : {
        auth      : false,
        hostname : 'spacesynter.com',
        loginUri : '/login',
        port     : 80
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
            database : 0
        },
        cookies : {
            host     : 'localhost',
            port     : 6379,
            database : 1,
            secret   : process.env.SESSION_KEY
        }
    }
};

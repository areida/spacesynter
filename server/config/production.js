/* jshint globalstrict: true */
'use strict';

module.exports = {
    api : {
        auth     : false,
        docker   : false,
        hostname : 'api.spacesynter.com',
        nginx    : false,
        port     : 80
    },
    app : {
        auth     : false,
        hostname : 'spacesynter.com',
        port     : 80
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

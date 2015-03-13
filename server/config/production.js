/* jshint globalstrict: true */
'use strict';

module.exports = {
    api : {
        auth     : false,
        docker   : false,
        hostname : 'api.spacesynter.com',
        nginx    : false,
        port     : 9000
    },
    app : {
        auth     : false,
        hostname : 'spacesynter.com',
        port     : 8000
    },
    github : {
        hostname  : 'api.github.com',
        port      : 443,
        secure    : true,
        userAgent : 'areida/spacesynter'
    },
    redis : {
        builds     : {
            host     : 'localhost',
            port     : 6379,
            database : 2
        },
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

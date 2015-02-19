/* jshint globalstrict: true */
'use strict';

module.exports = {
    api : {
        hostname  : 'spacesynter.com',
        port      : 80
    },
    github : {
        hostname  : 'api.github.com',
        port      : 443,
        secure    : true,
        userAgent : 'areida/spacesynter'
    },
    redis : {
        host     : 'localhost',
        port     : 6379,
        database : 1
    },
    server : {
        hostname : 'spacesynter.com',
        port     : 80
    }
};

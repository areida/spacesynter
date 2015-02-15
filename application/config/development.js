/* jshint globalstrict: true */
/* global __BACKEND__ */
'use strict';

var backend;

backend = __BACKEND__ || '%DEV_API_HOST%';

module.exports = {
    api : {
        hostname  : backend,
        port      : 80,
        client_id : '123'
    },
    github : {
        hostname : 'api.github.com',
        port     : 443,
        secure   : true
    },
    server : {
        port : 9000
    }
};

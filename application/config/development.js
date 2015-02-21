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
    loginUri : '/login'
};

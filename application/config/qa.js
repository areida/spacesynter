/* jshint globalstrict: true */
/* global __BACKEND__ */
'use strict';

module.exports = {
    api : {
        auth     : false,
        docker   : false,
        hostname : __BACKEND__ || 'localhost',
        nginx    : false,
        port     : __BACKEND__ ? 80 : 8000
    },
    server : {
        port : 9000
    }
};

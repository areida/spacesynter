'use strict';

var exec = require('child_process').exec;

module.exports = {
    'nginx:reload' : {
        perform : function (callback) {
            exec('service nginx reload', callback);
        }
    }
};

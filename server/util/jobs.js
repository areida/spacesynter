'use strict';

var exec = require('child_process').exec;

var vagrant = require('./vagrant');

module.exports = {
    'nginx:reload' : {
        perform : function (callback) {
            exec('service nginx reload', callback);
        }
    },
    'vagrant:destroy' : {
        perform : function (container, callback) {
            vagrant.destroy(container).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:reprovision' : {
        perform : function (container, callback) {
            vagrant.reprovision(container).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:rsync' : {
        perform : function (container, callback) {
            vagrant.rsync(container).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:up' : {
        perform : function (container, callback) {
            vagrant.up(container).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    }
};

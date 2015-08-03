'use strict';

var exec = require('child_process').exec;
var Q    = require('q');

var fs      = require('../util/fs');
var reload  = require('../util/reload');
var ps      = require('../util/ps');
var vagrant = require('./vagrant');

module.exports = {
    'nginx:reload' : {
        perform : function (callback) {
            exec('service nginx reload', callback);
        }
    },
    'vagrant:halt' : {
        perform : function (container, callback) {
            vagrant.runCommand(container, 'stopping', ['halt'], 'stopped').done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:destroy' : {
        perform : function (container, callback) {
            vagrant.runCommand(container, 'stopping', ['destroy', '-f'], 'stopped').then(
                function (container) {
                    return Q.all([
                        container.remove(),
                        fs.rmDir(container),
                        reload.exec()
                    ]);
                },
                callback
            ).then(
                function () {
                    callback(null);
                },
                callback
            );
        }
    },
    'vagrant:provision' : {
        perform : function (container, callback) {
            vagrant.runCommand(container, 'starting', ['provision'], 'running').done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:rsync' : {
        perform : function (container, callback) {
            vagrant.runCommand(container, 'starting', ['rsync'], 'running').done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:up' : {
        perform : function (container) {
            vagrant.runCommand(container, 'starting', ['up'], 'running').done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    }
};

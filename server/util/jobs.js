'use strict';

var exec = require('child_process').exec;

var Container = require('../model/container');
var Log       = require('../model/log');
var vagrant   = require('./vagrant');

module.exports = {
    'nginx:reload' : {
        perform : function (callback) {
            exec('service nginx reload', callback);
        }
    },
    'vagrant:destroy' : {
        perform : function (container, callback) {
            Container.updateStatus(container, 'destroying').then(
                function (container) {
                    return vagrant.runCommand('destroy', container);
                },
                callback
            ).then(
                function () {
                    return Container.updateStatus(container, 'stopped');
                },
                function (error) {
                    return Container.updateStatus(container, 'error');
                },
                Log.saveData
            ).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:reprovision' : {
        perform : function (container, callback) {
            Container.updateStatus(container, 'provisioning').then(
                function (container) {
                    return vagrant.runCommand('reprovision', container);
                },
                callback
            ).then(
                function () {
                    return Container.updateStatus(container, 'running');
                },
                function (error) {
                    return Container.updateStatus(container, 'error');
                },
                Log.saveData
            ).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:rsync' : {
        perform : function (container, callback) {
            Container.updateStatus(container, 'provisioning').then(
                function (container) {
                    return vagrant.runCommand('rsync', container);
                },
                callback
            ).then(
                function () {
                    return Container.updateStatus(container, 'running');
                },
                function (error) {
                    return Container.updateStatus(container, 'error');
                },
                Log.saveData
            ).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    },
    'vagrant:up' : {
        perform : function (container) {
            Container.updateStatus(container, 'provisioning').then(
                function (container) {
                    return vagrant.runCommand('up', contaner);
                },
                callback
            ).then(
                function () {
                    return Container.updateStatus(container, 'running');
                },
                function (error) {
                    return Container.updateStatus(container, 'error');
                },
                Log.saveData
            ).done(
                function (container) {
                    callback(null, container);
                },
                callback
            );
        }
    }
};

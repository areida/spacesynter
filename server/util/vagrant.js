'use strict';

var Q      = require('q');
var Resque = require('node-resque');
var spawn  = require('child_process').spawn;

var config    = require('../config');
var Container = require('../model/container');
var jobs      = require('./jobs');
var Log       = require('../model/log');

function runCommand(command, container) {
    return new Q.promise(
        function (resolve, reject, progress) {
            var commandId, options, proc;

            commandId = Math.random().toString(36);

            options = {
                stdio : 'inherit'
            };

            progress(
                container.build,
                commandId,
                container.id,
                'vagrant ' + command,
                'stdout',
                true
            );

            proc = spawn('vagrant', [command], options);

            proc.stdout.on('data', function (data) {
                progress(
                    container.build,
                    commandId,
                    container.id,
                    data,
                    'stdout'
                );
            });

            proc.stderr.on('data', function (data) {
                progress(
                    container.build,
                    commandId,
                    container.id,
                    data,
                    'stderr'
                );
            });

            proc.on('close', function (code) {
                if (code !== 0) reject(code);
                else resolve(container);
            });
        }
    );
}

function saveContainer(container, status) {
    return new Q.promise(
        function (resolve, reject) {
            Container.find({id : container}).exec().then(
                function (containers) {
                    if (containers.length) {
                        containers[0].status = status;

                        containers[0].save(
                            function (error) {
                                if (error) reject(error);
                                else resolve(containers[0]);
                            }
                        );
                    } else {
                        reject();
                    }
                },
                reject
            );
        }
    );
}

function saveLog(build, commandId, container, data, fd, initial) {
    var log = new Log({
        build     : build,
        commandId : commandId,
        container : container,
        data      : data,
        fd        : fd,
        initial   : !! initial
    });

    log.save();
}

module.exports = {
    destroy : function (container) {
        return saveContainer(container, 'destroying').then(
            function (container) {
                return runCommand('destroy', container);
            },
            function (error) {}
        ).then(
            function () {
                return saveContainer(container, 'stopped');
            },
            function (error) {
                return saveContainer(container, 'error');
            },
            saveLog
        );
    },
    reprovision : function (container) {
        return saveContainer(container, 'provisioning').then(
            function (container) {
                return runCommand('reprovision', container);
            },
            function (error) {}
        ).then(
            function () {
                return saveContainer(container, 'running');
            },
            function (error) {
                return saveContainer(container, 'error');
            },
            saveLog
        );
    },
    rsync : function (container) {
        return saveContainer(container, 'provisioning').then(
            function (container) {
                return runCommand('rsync', container);
            },
            function (error) {}
        ).then(
            function () {
                return saveContainer(container, 'running');
            },
            function (error) {
                return saveContainer(container, 'error');
            },
            saveLog
        );
    },
    up : function (container) {
        return saveContainer(container, 'provisioning').then(
            function (container) {
                return runCommand('up', container);
            },
            function (error) {}
        ).then(
            function () {
                return saveContainer(container, 'running');
            },
            function (error) {
                return saveContainer(container, 'error');
            },
            saveLog
        );
    }
};
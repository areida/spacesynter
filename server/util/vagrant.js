'use strict';

var path  = require('path');
var Q     = require('q');
var spawn = require('child_process').spawn;

var config    = require('../config');
var Container = require('../model/container');
var Log       = require('../model/log');
var resque    = require('./resque');

function runCommand(command, container) {
    return new Q.promise(
        function (resolve, reject, progress) {
            var commandId, options, proc;

            commandId = Math.random().toString(36);

            options = {
                cwd   : path.join(config.cwd, '__containers__', container.name, 'working'),
                env   : _.merge({PORT : container.port}, process.env),
                stdio : 'inherit'
            };

            progress(
                container.build,
                commandId,
                container.id,
                'vagrant ' + command.join(' '),
                'stdout',
                true
            );

            proc = spawn('vagrant', command, options);

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

module.exports = {
    delete : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:destroy', container.id);
            }
        );
    },
    restart : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:rsync', container.id);
            }
        );
    },
    start : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:up', container.id);
            }
        );
    },
    stop : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:halt', container.id);
            }
        );
    },
    runCommand : function (container, initialStatus, command, finalStatus) {
        return Container.updateStatus(container, initialStatus).then(
            function (container) {
                return runCommand(command, container);
            }
        ).then(
            function () {
                return Container.updateStatus(container, finalStatus);
            },
            function (error) {
                return Container.updateStatus(container, 'error');
            },
            Log.saveData
        );
    }
};
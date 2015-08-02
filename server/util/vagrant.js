'use strict';

var Q     = require('q');
var spawn = require('child_process').spawn;

var config = require('../config');
var resque = require('./resque');

module.exports = {
    destroy : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:destroy', container);
            }
        );
    },
    reprovision : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:reprovision', container);
            }
        );
    },
    rsync : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:rsync', container);
            }
        );
    },
    runCommand : function (command, container) {
        return new Q.promise(
            function (resolve, reject, progress) {
                var commandId, options, proc;

                commandId = Math.random().toString(36);

                options = {
                    cwd   : config.cwd + '/__containers__/' + container.name + '/working',
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
    },
    up : function (container) {
        return resque.connect().then(
            function (resque) {
                resque.enqueue('spacesynter', 'vagrant:up', container);
            }
        );
    }
};
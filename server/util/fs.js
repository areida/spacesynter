'use strict';

var fs    = require('fs');
var path  = require('path');
var Q     = require('q');
var spawn = require('child_process').spawn;

var config = require('../config');

module.exports = {
    changeBuild : function (container) {
        return new Q.promise(
            function (resolve, reject) {
                var buildPath  = path.join(config.containerDir, container.name, 'builds', container.build);
                var workingDir = path.join(config.containerDir, container.name, 'working');

                var unzip = spawn('unzip', ['-o', buildPath, '-d', workingDir]);

                unzip.stdout.on('data', function () {});
                unzip.stderr.on('data', function () {});

                unzip.on('close', function (code) {
                    if (code !== 0) reject(code);
                    else resolve();
                });
            }
        );
    },

    deleteBuild : function (container, build) {
        return new Q.promise(
            function (resolve, reject) {
                var file = path.join(config.containerDir, container.name, 'builds', build._id.toString());

                fs.unlink(file, function (error) {
                    if (error) reject(error);
                    else resolve();
                });
            }
        );
    },

    mkDir : function (dir) {
        return new Q.promise(
            function (resolve, reject) {
                fs.mkdir(dir, function (error) {
                    if (error) reject(error);
                    else resolve();
                });
            }
        );
    },

    rmDir : function (container) {
        return new Q.promise(
            function (resolve, reject) {
                var dir = path.join(config.containerDir, container.name);
                var rm  = spawn('rm', ['-rf', dir]);

                rm.on('close', function (code) {
                    if (code !== 0) reject(code);
                    else resolve();
                });
            }
        );
    },

    saveFile : function (filepath, data) {
        return new Q.promise(
            function (resolve, reject) {
                fs.writeFile(
                    filepath,
                    data,
                    function (error) {
                        if (error) reject(error);
                        else resolve();
                    }
                );
            }
        );
    }
};
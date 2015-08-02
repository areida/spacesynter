'use strict';

var exec   = require('child_process').exec
var fs     = require('fs');
var Q      = require('q');
var Resque = require('node-resque');
var tmpl   = require('blueimp-tmpl').tmpl;
var _      = require('lodash');

var config    = require('../config');
var jobs      = require('./jobs');

tmpl.load = function (name) {
    return fs.readFileSync(config.cwd + '/templates/' + name, 'utf8');
};

function resqueConnect() {
    return new Q.promise(
        function (resolve, reject) {
            var queue = new Resque.queue(
                {connection: config.redis.resque},
                jobs,
                function (error) {
                    if (error) reject(error);
                    else resolve(queue);
                }
            );
        }
    );
}

module.exports = {
    reload : function (containers) {
        return resqueConnect().then(
            function (resque) {
                return new Q.promise(
                    function (resolve, reject) {
                        fs.writeFile(
                            config.containerDir + '/servers.conf',
                            tmpl('servers.conf', {
                                containers : containers
                            }),
                            function (error) {
                                if (error) reject(error);
                                else {
                                    resque.enqueue('nr:nginx', 'nginx:reload', []);
                                    resolve();
                                }
                            }
                        );
                    }
                );
            },
            function (error) {
                reject(error);
            }
        );
    }
}

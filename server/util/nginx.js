'use strict';

var exec   = require('child_process').exec
var fs     = require('fs');
var Q      = require('q');
var Redis  = require('then-redis');
var Resque = require('node-resque');
var tmpl   = require('blueimp-tmpl').tmpl;
var _      = require('lodash');

var config    = require('../config');
var Container = require('../model/container');
var jobs      = require('./jobs');

tmpl.load = function (name) {
    return fs.readFileSync(config.cwd + '/templates/' + name, 'utf8');
};

var hipache = Redis.createClient(config.redis.hipache);

function resqueConnect() {
    return new Q.promise(
        function (resolve, reject) {
            var queue = new Resque.queue(
                {connection: config.redis.resque},
                jobs,
                function (error) {
                    if (error) reject(error);

                    resolve(queue);
                }
            );
        }
    );
}

module.exports = {
    reload : function() {
        return Q.promise(
            function (resolve, reject) {
                if (config.nginx) {
                    Q.all([
                        resqueConnect(),
                        Container.find({}).exec()
                    ]).done(
                        function (responses) {
                            fs.writeFile(
                                config.containerDir + '/servers.conf',
                                tmpl('servers.conf', {
                                    containers   : responses[1],
                                    containerDir : config.containerDir
                                }),
                                function (error) {
                                    if (error) {
                                        reject();
                                    } else {
                                        responses[0].enqueue('nr:nginx', 'nginx:reload', []);
                                        resolve();
                                    }
                                }
                            );
                        },
                        function (error) {
                            reject(error);
                        }
                    );
                } else if (config.hipache) {
                    Container.find({}).exec().then(
                        function (containers) {
                            Q.all(containers.map(
                                function (container) {
                                    var key = 'frontend:' + container.host;

                                    return hipache.llen(key).then(
                                        function (size) {
                                            var updates;

                                            if (size) {
                                                updates = [
                                                    hipache.lset(key, 0, container.host.split('.')[0]),
                                                    hipache.lset(key, 1, 'http://localhost:' + container.port)
                                                ];
                                            } else {
                                                updates = [
                                                    hipache.rpush(key, container.host.split('.')[0]),
                                                    hipache.rpush(key, 'http://localhost:' + container.port)
                                                ];
                                            }

                                            return Q.all(updates);
                                        }
                                    );
                                }
                            )).done(
                                function () {
                                    resolve();
                                },
                                function (error) {
                                    reject(error);
                                }
                            );
                        }
                    );
                } else {
                    resolve();
                }
            }
        );
    }
}

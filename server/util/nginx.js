var exec   = require('child_process').exec
var fs     = require('fs');
var Q      = require('q');
var Resque = require('node-resque');
var tmpl   = require('blueimp-tmpl').tmpl;

var config    = require('../config');
var Container = require('../model/container');
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
                                        responses[0].enqueue('nr:nginx', 'reload', []);
                                        resolve();
                                    }
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

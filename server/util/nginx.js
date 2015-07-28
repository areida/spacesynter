var exec = require('child_process').exec
var fs   = require('fs');
var Q    = require('q');
var tmpl = require('blueimp-tmpl').tmpl;

var config    = require('../config');
var Container = require('../model/container');

tmpl.load = function (name) {
    return fs.readFileSync(process.cwd() + '/templates/' + name, 'utf8');
};

module.exports = {
    reload : function() {
        return Q.promise(
            function (resolve, reject) {
                Container.find({}).exec().then(
                    function (containers) {
                        fs.writeFile(
                            config.app.serverDir + '/servers.temp',
                            tmpl('servers.conf', {
                                containers   : containers,
                                containerDir : config.app.containerDir
                            }),
                            function (error) {
                                if (error) {
                                    reject();
                                } else {
                                    if (config.nginx) {
                                        exec(
                                            'service nginx reload',
                                            function (error) {
                                                if (error) {
                                                    reject(error);
                                                } else {
                                                    resolve();
                                                }
                                            }
                                        );
                                    } else {
                                        resolve();
                                    }
                                }
                            }
                        );
                    }
                );
            }
        );
    }
}

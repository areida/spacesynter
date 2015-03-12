var Fs       = require('fs');
var Q        = require('q');
var Reloader = require('nginx-reload');
var Tmpl     = require('blueimp-tmpl').tmpl;

var config    = require('./config');
var Container = require('./container');

var reloader;

if (config.api.nginx) {
    reloader = new Reloader();
}

Tmpl.load = function (name) {
    return Fs.readFileSync(process.cwd() + '/templates/' + name, 'utf8');
};

module.exports = {
    reload : function() {
        return Q.promise(
            function (resolve, reject) {
                Container.find({})
                    .exec()
                    .then(
                        function (containers) {
                            var conf = Tmpl('servers.conf', {containers : containers});

                            Fs.writeFile(
                                '/home/andrew/servers.conf',
                                conf,
                                function (err) {
                                    if (err) {
                                        reject();
                                    } else {
                                        if (config.api.nginx) {
                                            reloader.reload(
                                                function (err) {
                                                    if (err) {
                                                        reject();
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

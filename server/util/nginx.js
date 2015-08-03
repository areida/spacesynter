'use strict';

var fs   = require('fs');
var path = require('path');
var Q    = require('q');
var tmpl = require('blueimp-tmpl').tmpl;

var config = require('../config');
var resque = require('./resque');

tmpl.load = function (name) {
    return fs.readFileSync(path.join(config.cwd, 'templates', name), 'utf8');
};

module.exports = {
    reload : function (containers) {
        return resque.connect().then(
            function (resque) {
                return new Q.promise(
                    function (resolve, reject) {
                        fs.writeFile(
                            path.join(config.containerDir, 'servers.conf'),
                            tmpl('servers.conf', {
                                containers : containers
                            }),
                            function (error) {
                                if (error) reject(error);
                                else {
                                    resque.enqueue('spacesynter', 'nginx:reload', []);
                                    resolve();
                                }
                            }
                        );
                    }
                );
            },
            reject
        );
    }
}

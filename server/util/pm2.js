'use strict';

var path = require('path');
var pm2  = require('pm2');
var Q    = require('q');

var config = require('../config');

function getOptions(container) {
    var cwd, script;

    if (container.type === 'static') {
        cwd    = path.join(config.containerDir, container.name, 'working', container.path);
        script = path.join(config.cwd, 'server', 'static.js');
    } else {
        cwd    = path.join(config.containerDir, container.name, 'working');
        script = path.join(config.containerDir, container.name, 'working', container.path);
    }

    return {
        env : {
            APP_ENV : 'qa',
            CWD     : cwd,
            PORT    : container.port
        },
        name   : container.name,
        script : script
    };
}

module.exports = {
    delete : function (container) {
        return new Q.promise(
            function (resolve, reject) {
                pm2.connect(
                    function (error) {
                        if (error) reject(error);
                        else pm2.delete(container.name, resolve);
                    }
                );
            }
        );
    },
    restart : function (container) {
        return this.start(container);
    },
    start : function (container) {
        return new Q.promise(
            function (resolve, reject) {
                pm2.connect(
                    function (error) {
                        if (error) reject(error);
                        else {
                            pm2.start(
                                getOptions(container),
                                function (error) {
                                    if (error) reject(error);
                                    else {
                                        container.status = 'running';

                                        container.save().then(resolve, reject);
                                    };
                                }
                            );
                        }
                    }
                );
            }
        );
    },
    stop : function (container) {
        return this.delete(container).then(
            function () {
                container.status = 'stopped';

                return container.save();
            }
        );
    }
};
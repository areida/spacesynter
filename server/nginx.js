var Fs       = require('fs');
var Q        = require('q');
var Redis    = require('then-redis');
var Reloader = require('nginx-reload');
var Tmpl     = require('blueimp-tmpl').tmpl;

var config = require('./config');

var redisClient, reloader;

redisClient = Redis.createClient(config.redis.containers);

if (config.api.nginx) {
    reloader = new Reloader();
}

Tmpl.load = function (name) {
    return Fs.readFileSync(process.cwd() + '/templates/' + name, 'utf8');
};

module.exports = {
    reload : function() {
        return Q.promise(function (resolve, reject) {
            redisClient.keys('*').then(function (keys) {
                if (keys.length) {
                    redisClient.mget(keys).then(function (containers) {
                        containers = containers.map(function (container) { return JSON.parse(container); });

                        Fs.writeFile('/home/ubuntu/servers.conf', Tmpl('servers.conf', {containers : containers}), function (err) {
                            if (err) {
                                reject();
                            } else {
                                if (config.api.nginx) {
                                    reloader.reload(function (err) {
                                        if (err) {
                                            reject();
                                        } else {
                                            resolve();
                                        }
                                    });
                                } else {
                                    resolve();
                                }
                            }
                        });
                    });
                } else {
                    resolve();
                }
            });
        });
    }
}

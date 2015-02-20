var Fs       = require('fs');
var Q        = require('q');
var Redis    = require('then-redis');
var Reloader = require('nginx-reload');
var Tmpl     = require('blueimp-tmpl').tmpl;

var config = require('../application/config');
var redisClient, reloader = new Reloader();

redisClient = Redis.createClient(config.redis.containers);

Tmpl.load = function (name) {
    return Fs.readFileSync(process.cwd() + '/templates/' + name, 'utf8');
};

module.exports = {
    reload : function() {
        return Q.promise(function (resolve, reject) {
            redisClient.keys('*').then(function (keys) {
                if (keys.length) {
                    db.hgetall(keys).then(function (containers) {
                        var serverConf = Tmpl('server.conf', {containers : containers});
                        Fs.writeFile('/home/ubuntu/servers.conf', serverConf, function (err) {
                            if (err) {
                                reject();
                            } else {
                                reloader.reload(function (err) {
                                    if (err) {
                                        reject();
                                    } else {
                                        resolve();
                                    }
                                });
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
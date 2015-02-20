var Fs       = require('fs');
var Redis    = require('then-redis');
var Reloader = require('nginx-reload');
var Tmpl     = require('blueimp-tmpl').tmpl;

var config = require('../application/config');
var db, reloader = new Reloader();

db = Redis.createClient(config.redis);

module.exports = {
    reload : function(containers, callback) {
        var serverConf;

        if (typeof callback === 'undefined') {
            callback   = containers;
            containers = [];
        }

        console.log('here', containers);

        serverConf = Tmpl('server.conf', {containers : containers});

        db.hgetall(keys).then(function (data) {
            Fs.writeFile('/home/ubuntu/servers.conf', serverConf, function (err) {
                reloader.reload();
            });
        });
    }
}
var Fs       = require('fs');
var Reloader = require('nginx-reload');
var Tmpl     = require('blueimp-tmpl').tmpl;

var config = require('../application/config');

Tmpl.load = function () {
    return Fs.readFileSync(process.cwd() + '/templates/servers.conf', 'utf8');
};

var db, reloader = new Reloader();

db = Redis.createClient(config.redis);

module.exports = {
    reload : function(data) {
        db.hgetall(keys).then(function (data) {
            Fs.writeFile('/home/ubuntu/servers.conf', Tmpl('servers', items), function (err) {
                reloader.reload();
            });
        });
    }
}
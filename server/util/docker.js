var Docker = require('docker.io');
var Q      = require('q');

var config = require('../config');

var docker = new Docker({socketPath : '/var/run/docker.sock'});

module.exports = {
    create : function(name, image)
    {
        var options = {
            name       : name,
            Hostname   : name + '.' + config.app.hostname,
            HostConfig : {
                PublishAllPorts : true,
                Binds           : [process.cwd() + ':/srv/www']
            },
            Cmd   : [],
            Image : image || 'synapse/api-base'
        };

        return new Q.Promise(function (resolve, reject) {
            docker.containers.create(options, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response, options);
                }
            });
        });
    },
    inspect : function(id)
    {
        return new Q.Promise(function (resolve, reject) {
            docker.containers.inspect(id, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    },
    kill : function(id)
    {
        return new Q.Promise(function (resolve, reject) {
            docker.containers.kill(id, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
};
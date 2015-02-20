var Docker  = require('docker.io');
var Q       = require('q');
var config  = require('../application/config');

var docker;

docker = new Docker({socketPath : '/var/run/docker.sock'});

module.exports = {
    create : function(name, image)
    {
        var options = {
            name       : name,
            HostName   : name + '.' + config.app.hostname,
            HostConfig : {
                PublishAllPorts : true,
                VolumesFrom     : [process.cwd(), '/srv/www']
            },
            Image : image || 'synapse/api-base-image'
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
            docker.containers.inspect({id : id}, function (error, response) {
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
            docker.containers.kill({id : id}, function (error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
};
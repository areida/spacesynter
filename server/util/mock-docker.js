var Q = require('q');

var appConfig = require('../../application/config');
var config    = require('../config');

module.exports = {
    create : function(name, image)
    {
        return Q.fcall(function () {
            return {
                Id       : Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7),
                Hostname : name + '.' + appConfig.api.hostname,
                Image    : image || 'synapse/api-base-image'
            };
        });
    },
    inspect : function(id, response)
    {
        return Q.fcall(function () {
            return {
                HostConfig : {
                    Ports : [{
                        PrivatePort : 22,
                        PublicPort  : 12345
                    }, {
                        PrivatePort : 80,
                        PublicPort  : 23456
                    }]
                },
                Hostname : response.Hostname,
                Id       : id,
                Image    : response.image,
                state    : {}
            };
        });
    },
    kill : function(id)
    {
        return Q.fcall(function () {
            return true;
        });
    }
};
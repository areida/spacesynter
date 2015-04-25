var Q = require('q');

var config = require('../config');

module.exports = {
    create : function(name, image)
    {
        return Q.fcall(function () {
            return {
                Id       : Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7),
                Image    : image || 'synapse/api-base-image',
                Hostname : name + '.' + config.app.hostname
            };
        });
    },
    inspect : function(id)
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
                state : {}
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
'use strict';

var Q     = require('q');
var Redis = require('then-redis');

var config = require('../config');

var redis = Redis.createClient(config.redis.hipache);

module.exports = {
    reload : function (containers) {
        return Q.all(
            containers.map(
                function (container) {
                    var key = 'frontend:' + container.host;

                    return redis.llen(key).then(
                        function (size) {
                            var host, name, updates;

                            host = 'http://localhost:' + container.port;
                            name = container.host.split('.')[0];

                            if (size) {
                                updates = [
                                    redis.lset(key, 0, name),
                                    redis.lset(key, 1, host)
                                ];
                            } else {
                                updates = [
                                    redis.rpush(key, name, host)
                                ];
                            }

                            return Q.all(updates);
                        }
                    );
                }
            )
        );
    }
};
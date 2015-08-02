'use strict';

var Q      = require('q');
var Resque = require('node-resque');

var config = require('../config');
var jobs   = require('./jobs');

module.exports = {
    connect : function () {
        return new Q.promise(
            function (resolve, reject) {
                var queue = new Resque.queue(
                    {connection: config.redis.resque},
                    jobs,
                    function (error) {
                        if (error) reject(error);
                        else resolve(queue);
                    }
                );
            }
        );
    }
};
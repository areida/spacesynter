'use strict';

var Q = require('q');

var config    = require('../config');
var Container = require('../model/container');
var hipache   = require('./hipache');
var nginx     = require('./nginx');

module.exports = {
    exec : function() {
        return Q.promise(
            function (resolve, reject) {
                Container.find({}).exec().then(
                    function (containers) {
                        if (config.nginx) {
                            nginx.reload(containers).done(resolve, reject);
                        } else if (config.hipache) {
                            hipache.reload(containers).done(resolve, reject)
                        } else {
                            resolve();
                        }
                    },
                    function (error) {
                        reject(error);
                    }
                );
            }
        );
    }
}

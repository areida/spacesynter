'use strict';

var mongoose = require('mongoose');
var Q        = require('q');

var Container, schema;

schema = new mongoose.Schema({
    build  : String,
    builds : [{
        created : {type : Date, default : Date.now},
        name    : String,
        path    : String
    }],
    created : {type : Date, default : Date.now},
    host    : String,
    id      : String,
    name    : {type : String, index : true},
    path    : String,
    port    : String,
    type    : {type : String, default : 'nodejs'}
});

schema.static(
    'updateStatus',
    function (container, status) {
        var Schema = this;

        return new Q.promise(
            function (resolve, reject) {
                Schema.find({id : container}).exec().then(
                    function (containers) {
                        if (containers.length) {
                            containers[0].status = status;

                            containers[0].save(
                                function (error) {
                                    if (error) reject(error);
                                    else resolve(containers[0]);
                                }
                            );
                        } else {
                            reject(404);
                        }
                    },
                    reject
                );
            }
        );
    }
);

Container = mongoose.model('Container', schema);

module.exports = Container;

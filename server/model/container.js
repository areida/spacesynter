'use strict';

var mongoose = require('mongoose');
var Q        = require('q');

var Container, schema;

schema = new mongoose.Schema({
    backend : String,
    build   : String,
    builds  : [{
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
    status  : {
        type    : String,
        enum    : ['stopped', 'starting', 'running', 'stopping'],
        default : 'stopped'
    },
    type : {
        type    : String,
        enum    : ['nodejs', 'php', 'static'],
        default : 'nodejs'
    }
});

schema.static(
    'updateStatus',
    function (container, status) {
        var Schema = this;

        return new Q.promise(
            function (resolve, reject) {
                Schema.findById(container).exec().then(
                    function (container) {
                        if (container) {
                            container.status = status;

                            container.save().then(resolve, reject);
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

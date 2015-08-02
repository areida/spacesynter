'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Container, schema;

schema = new Schema({
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

Container = mongoose.model('Container', schema);

module.exports = Container;

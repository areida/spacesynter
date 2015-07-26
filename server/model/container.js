var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Container, containerSchema;

containerSchema = new Schema({
    created : {type : Date, default : Date.now},
    host    : String,
    id      : String,
    name    : { type : String, index : true},
    port    : String,
    build   : String,
    builds  : [{
        created : {type : Date, default : Date.now},
        name    : String,
        path    : String
    }]
});

Container = mongoose.model('Container', containerSchema);

module.exports = Container;

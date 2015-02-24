var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Container, containerSchema;

containerSchema = new Schema({
    name    : { type : String, index : true},
    host    : String,
    id      : String,
    image   : String,
    created : {type : Date, default : Date.now},
    builds  : [{
        created : {type : Date, default : Date.now},
        name    : String,
        path    : String
    }]
});

Container = mongoose.model('Container', containerSchema);

module.exports = Container;
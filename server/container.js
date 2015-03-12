var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Container, containerSchema;

containerSchema = new Schema({
    name    : { type : String, index : true},
    host    : String,
    id      : String,
    image   : String,
    created : {type : Date, default : Date.now},
    state   : String,
    builds  : [{
        created : {type : Date, default : Date.now},
        name    : String,
        path    : String
    }],
    activeBuild : String,
    ports : {
        22 : String,
        80 : String
    }
});

Container = mongoose.model('Container', containerSchema);

module.exports = Container;

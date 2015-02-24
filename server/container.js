var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var containerSchema = new Schema({
    name   : { type : String, index : true},
    id     : String,
    image  : String,
    host   : String,
    builds : [{
        date : Date,
        name : String,
        path : String
    }]
});

var Container = mongoose.model('Container', containerSchema);

module.exports = Container;
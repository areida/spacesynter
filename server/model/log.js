'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Log, schema;

schema = new Schema({
    build     : String,
    commandId : String,
    container : String,
    data      : [String],
    date      : {type : Date, default : Date.now},
    fd        : String,
    id        : String,
    initial   : Boolean
});

Log = mongoose.model('Log', schema);

module.exports = Log;

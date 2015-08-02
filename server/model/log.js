'use strict';

var mongoose = require('mongoose');

var Log, schema;

schema = new mongoose.Schema({
    build     : String,
    commandId : String,
    container : String,
    data      : [String],
    date      : {type : Date, default : Date.now},
    fd        : String,
    id        : String,
    initial   : Boolean
});

function saveLog() {
}

schema.static(
    'saveData',
    function (build, commandId, container, data, fd, initial) {
        return this.create({
            build     : build,
            commandId : commandId,
            container : container,
            data      : data,
            fd        : fd,
            initial   : !! initial
        });
    }
);

Log = mongoose.model('Log', schema);

module.exports = Log;

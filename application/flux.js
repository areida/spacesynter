'use strict';

var Fluxxor = require('fluxxor');

var Stores  = require('./stores');
var actions = require('./actions');

module.exports = function () {
    return new Fluxxor.Flux(Stores, actions);
};
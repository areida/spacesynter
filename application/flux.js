'use strict';

var Fluxxor = require('fluxxor');
var Q       = require('q');
var _       = require('lodash');

var Stores  = require('./stores');
var actions = require('./actions');

module.exports = function () {
    return new Fluxxor.Flux(Stores, actions);
};
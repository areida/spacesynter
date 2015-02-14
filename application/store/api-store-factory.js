/* jshint globalstrict: true */
'use strict';

var _            = require('underscore');
var Fluxxor      = require('fluxxor');
var BaseAPIStore = require('./base-api-store');

var APIStoreFactory = function () {};

APIStoreFactory.prototype.createStore = function(customStoreProperties)
{
    var baseStore    = new BaseAPIStore();
    var storeProperties = _.extend(baseStore, customStoreProperties);

    return Fluxxor.createStore(storeProperties);
};

module.exports = new APIStoreFactory();
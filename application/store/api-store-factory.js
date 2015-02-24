'use strict';

var _            = require('underscore');
var Fluxxor      = require('fluxxor');
var BaseAPIStore = require('./base-api-store');

class APIStoreFactory {
    createStore(props)
    {
        return Fluxxor.createStore(_.extend(new BaseAPIStore(), props));
    }
}

module.exports = new APIStoreFactory();

/* jshint globalstrict: true */
'use strict';

var Fluxxor = require('fluxxor');
var Q       = require('q');
var _       = require('underscore');
var stores  = require('./stores');
var actions = require('./actions');

var Flux = function() {
    var Stores = {};

    _.each(stores, function(Store, name) {
        Stores[name] = new Store();
    });

    Fluxxor.Flux.call(this, Stores, actions);
};

Flux.prototype = Object.create(Fluxxor.Flux.prototype);

Flux.prototype.fetchData = function(state)
{
    var flux, params;

    flux   = this;
    params = _.extend({}, state.query, state.params);

    return Q.all(state.routes
        .filter(function (route) {
            return route.handler.fetchData;
        })
        .reduce(function (promises, route) {
            var promise = route.handler.fetchData(flux, params);

            if (Array.isArray(promise)) {
                promises.concat(promise);
            } else {
                promises.push(promise);
            }

            return promises;
        }, []));
};

Flux.prototype.fromObject = function(object)
{
    var stores = this.stores;

    _.each(object, function (state, name) {
        stores[name].setState(state);
    });

    return this;
};

Flux.prototype.toObject = function()
{
    var data = {};

    _.each(this.stores, function (store, name) {
        data[name] = store.getState();
    });

    return data;
};

module.exports = Flux;
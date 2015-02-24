/* jshint globalstrict: true, esnext: true */
'use strict';

var Fluxxor = require('fluxxor');
var Q       = require('q');
var _       = require('underscore');
var stores  = require('./stores');
var actions = require('./actions');

class Flux extends Fluxxor.Flux {
    constructor()
    {
        var Stores = {};

        _.each(stores, (Store, name) => Stores[name] = new Store());

        super(Stores, actions);
    }

    fetchData(state)
    {
        var flux, params;

        flux   = this;
        params = _.extend({}, state.query, state.params);

        return Q.all(
            state.routes
                .filter(route => route.handler.fetchData)
                .reduce(
                    (promises, route) => promises.push(route.handler.fetchData(flux, params)),
                    []
                )
        );
    }

    fromObject(object)
    {
        _.each(object, (state, name) => this.stores[name].fromObject(state), this);

        return this;
    }

    toObject()
    {
        var data = {};

        _.each(this.stores, (store, name) => data[name] = store.toObject());

        return data;
    }
}

module.exports = Flux;

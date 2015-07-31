'use strict';

var Store     = require('fluxxor/lib/store');
var Immutable = require('immutable');

class ApiStore extends Store {
    constructor()
    {
        var state = new Immutable.Map({
            loaded  : false,
            loading : false
        });

        super();

        this.state = state.merge(this.state);
    }

    isLoading()
    {
        return this.state.get('loading');
    }

    isLoaded()
    {
        return this.state.get('loaded');
    }
}

module.exports = ApiStore;
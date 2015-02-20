/* jshint globalstrict: true */
'use strict';

var Immutable = require('immutable');

var constants       = require('../constants');
var APIStoreFactory = require('./api-store-factory');

var ContainerStore = APIStoreFactory.createStore({
    initialize : function()
    {
        this.state = {
            containers : new Immutable.List(),
            loaded     : false,
            loading    : false
        };

        this.bindActions(
            constants.CONTAINER_FETCH_ALL, 'onFetchAll',
            constants.CONTAINER_FETCH_ALL_SUCCESS, 'onFetchAllSuccess'
        );
    },

    fromObject : function(object)
    {

        this.state = {
            containers : new Immutable.List(object.containers),
            loaded     : object.loaded,
            loading    : object.loading
        };

        return this;
    },

    getAll : function()
    {
        return this.state.containers;
    },

    onFetchAll : function()
    {
        this.state.loading = true;

        this.emit('change');
    },

    onFetchAllSuccess : function(containers)
    {
        this.state.loaded = true;
        this.state.containers.merge(containers);

        this.emit('change');
    }
});

module.exports = ContainerStore;

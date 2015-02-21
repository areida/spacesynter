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
            constants.CONTAINER_FETCH_ALL_SUCCESS, 'onFetchAllSuccess',
            constants.CONTAINER_CREATE_SUCCESS, 'onCreateSuccess',
            constants.CONTAINER_KILL, 'onKill'
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

    onCreateSuccess : function(container)
    {
        this.state.containers = this.state.containers.push(new Immutable.Map(container));

        this.emit('change');
        this.emit('created');
    },

    onFetchAll : function()
    {
        this.state.loading = true;

        this.emit('change');
    },

    onFetchAllSuccess : function(containers)
    {
        this.state.loaded = true;
        this.state.containers = this.state.containers.merge(containers);

        this.emit('change');
    },

    onKill : function(name)
    {
        this.state.containers = this.state.containers.filterNot(function (container) {
            return container.get('name') === name;
        });

        this.emit('change');
    }
});

module.exports = ContainerStore;

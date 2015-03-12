'use strict';

var Immutable = require('immutable');

var constants       = require('../constants');
var APIStoreFactory = require('./api-store-factory');

var ContainerStore = APIStoreFactory.createStore({
    initialize()
    {
        this.state = {
            containers : new Immutable.List(),
            loaded     : false,
            loading    : false
        };

        this.bindActions(
            constants.BUILD_CREATE_SUCCESS, 'onBuildCreateSuccess',
            constants.CONTAINER_FETCH_ALL, 'onFetchAll',
            constants.CONTAINER_FETCH_ALL_SUCCESS, 'onFetchAllSuccess',
            constants.CONTAINER_CREATE_SUCCESS, 'onCreateSuccess',
            constants.CONTAINER_KILL, 'onKill'
        );
    },

    fromObject(object)
    {
        this.state = {
            containers : new Immutable.List(object.containers),
            loaded     : object.loaded,
            loading    : object.loading
        };

        return this;
    },

    getAll()
    {
        return this.state.containers;
    },

    onBuildCreateSuccess(container)
    {
        this.state.containers = this.state.containers.merge([container]);

        this.emit('change');
    },

    onCreateSuccess(container)
    {
        container.builds = new Immutable.List(container.builds);
        container.ports  = new Immutable.Map(container.ports);

        this.state.containers = this.state.containers.push(new Immutable.Map(container));

        this.emit('change');
        this.emit('created');
    },

    onFetchAll()
    {
        this.state.loading = true;

        this.emit('change');
    },

    onFetchAllSuccess(containers)
    {
        this.state.loaded = true;
        this.state.containers = this.state.containers.merge(containers);

        this.emit('change');
    },

    onKill(name)
    {
        this.state.containers = this.state.containers.filterNot(container => container.get('name') === name);

        this.emit('change');
    }
});

module.exports = ContainerStore;

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
        var index = this.state.containers
            .findIndex(c => c.get('name') === container.name);

        this.state.containers = this.state.containers.set(index, Immutable.fromJS(container));

        this.emit('change');
    },

    onCreateSuccess(container)
    {
        this.state.containers = this.state.containers.push(Immutable.fromJS(container));

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
        this.state.loaded     = true;
        this.state.containers = Immutable.fromJS(containers);

        this.emit('change');
    },

    onKill(name)
    {
        this.state.containers = this.state.containers.filterNot(container => container.get('name') === name);

        this.emit('change');
    }
});

module.exports = ContainerStore;

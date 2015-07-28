'use strict';

var constants       = require('../constants');
var containerClient = require('../client/container');

module.exports = {
    activateBuild(name, build)
    {
        return containerClient.activateBuild(name, build).then(
            container => this.dispatch(constants.ACTIVATE_BUILD_SUCCESS, container)
        );
    },

    create(name)
    {
        return containerClient.create(name).then(
            container => this.dispatch(constants.CONTAINER_CREATE_SUCCESS, container)
        );
    },

    deleteBuild(name, build)
    {
        return containerClient.deleteBuild(name, build).then(
            () => this.dispatch(constants.DELETE_BUILD_SUCCESS, {name : name, build : build})
        );
    },

    fetch(name)
    {
        return containerClient.fetch(name).then(
            container => this.dispatch(constants.CONTAINER_FETCH_SUCCESS, container)
        );
    },

    fetchAll()
    {
        return containerClient.fetchAll().then(
            containers => this.dispatch(constants.CONTAINER_FETCH_ALL_SUCCESS, containers)
        );
    },

    kill(name)
    {
        return containerClient.kill(name).then(
            () => this.dispatch(constants.CONTAINER_KILL_SUCCESS, name)
        );
    }
};



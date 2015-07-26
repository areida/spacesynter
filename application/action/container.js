'use strict';

var constants       = require('../constants');
var containerClient = require('../client/container');

module.exports = {
    activateBuild(name, build)
    {
        this.dispatch(constants.ACTIVATE_BUILD, name, build);

        return containerClient.activateBuild(name, build).then(
            data => this.dispatch(constants.ACTIVATE_BUILD_SUCCESS, data)
        );
    },

    create(name)
    {
        this.dispatch(constants.CONTAINER_CREATE, name);

        return containerClient.create(name).then(
            data => this.dispatch(constants.CONTAINER_CREATE_SUCCESS, data)
        );
    },

    deleteBuild(name, build)
    {
        this.dispatch(constants.DELETE_BUILD, name, build);

        return containerClient.activateBuild(name, build).then(
            () => this.dispatch(constants.DELETE_BUILD_SUCCESS, {name : name, build : build})
        );
    },

    fetch(name)
    {
        this.dispatch(constants.CONTAINER_FETCH, name);

        return containerClient.fetch(name).then(
            response => this.dispatch(constants.CONTAINER_FETCH_SUCCESS, response)
        );
    },

    fetchAll()
    {
        this.dispatch(constants.CONTAINER_FETCH_ALL);

        return containerClient.fetchAll().then(
            response => this.dispatch(constants.CONTAINER_FETCH_ALL_SUCCESS, response)
        );
    },

    kill(name)
    {
        this.dispatch(constants.CONTAINER_KILL, name);

        return containerClient.kill(name).then(
            response => this.dispatch(constants.CONTAINER_KILL_SUCCESS, response)
        );
    }
};



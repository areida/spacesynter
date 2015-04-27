'use strict';

var constants       = require('../constants');
var containerClient = require('../client/container');

module.exports = {
    activateBuild(container, name)
    {
        var flux = this;

        this.dispatch(constants.ACTIVATE_BUILD, container, name);

        return containerClient.activateBuild(container, name).then(
            data => flux.dispatch(constants.ACTIVATE_BUILD_SUCCESS, data)
        );
    },

    create(container)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_CREATE, container);

        return containerClient.create(container).then(
            data => flux.dispatch(constants.CONTAINER_CREATE_SUCCESS, data)
        );
    },

    fetch(name)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_FETCH, name);

        return containerClient.fetch(name).then(
            response => flux.dispatch(constants.CONTAINER_FETCH_SUCCESS, response)
        );
    },

    fetchAll()
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_FETCH_ALL);

        return containerClient.fetchAll().then(
            response => flux.dispatch(constants.CONTAINER_FETCH_ALL_SUCCESS, response)
        );
    },

    kill(name)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_KILL, name);

        return containerClient.kill(name).then(
            response => flux.dispatch(constants.CONTAINER_KILL_SUCCESS, response)
        );
    }
};



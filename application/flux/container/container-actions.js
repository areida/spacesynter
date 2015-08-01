'use strict';

import constants       from '../../constants';
import ContainerClient from './container-client';

let client = new ContainerClient();

export default {
    activateBuild(name, build)
    {
        return client.activateBuild(name, build).then(
            container => this.dispatch(constants.ACTIVATE_BUILD_SUCCESS, container)
        );
    },

    create(name, path, type)
    {
        return client.create(name, path, type).then(
            container => this.dispatch(constants.CONTAINER_CREATE_SUCCESS, container)
        );
    },

    deleteBuild(name, build)
    {
        return client.deleteBuild(name, build).then(
            () => this.dispatch(constants.DELETE_BUILD_SUCCESS, {name : name, build : build})
        );
    },

    fetch(name)
    {
        return client.fetch(name).then(
            container => this.dispatch(constants.CONTAINER_FETCH_SUCCESS, container)
        );
    },

    fetchAll()
    {
        return client.fetchAll().then(
            containers => this.dispatch(constants.CONTAINER_FETCH_ALL_SUCCESS, containers)
        );
    },

    kill(name)
    {
        return client.kill(name).then(
            () => this.dispatch(constants.CONTAINER_KILL_SUCCESS, name)
        );
    }
};



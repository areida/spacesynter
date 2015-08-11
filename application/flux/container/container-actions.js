'use strict';

import constants       from '../constants';
import ContainerClient from './container-client';

let client = new ContainerClient();

export default {
    create(name, path, type, backend)
    {
        return client.create(name, path, type, backend).then(
            container => this.dispatch(constants.CONTAINER_CREATE_SUCCESS, container)
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



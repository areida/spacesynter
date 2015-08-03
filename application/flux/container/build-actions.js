'use strict';

import BuildClient from './build-client';
import constants   from '../../constants';

let client = new BuildClient();

export default {
    activate(container, build)
    {
        return client.activate(container, build).then(
            container => this.dispatch(constants.ACTIVATE_BUILD_SUCCESS, container)
        );
    },

    create(container, file, progress)
    {
        return client.create(container, file)
            .then(
                data => this.dispatch(constants.CREATE_BUILD_SUCCESS, data),
                () => console.warn,
                progress => this.dispatch(constants.CREATE_BUILD_PROGRESS, {container, progress})
            );
    },

    deactivate(container, build)
    {
        return client.deactivate(container, build).then(
            container => this.dispatch(constants.DEACTIVATE_BUILD_SUCCESS, container)
        );
    },

    'delete'(container, build)
    {
        return client['delete'](container, build).then(
            container => this.dispatch(constants.DELETE_BUILD_SUCCESS, container)
        );
    },

    update(container, build, name)
    {
        return client.update(container, build, name).then(
            container => this.dispatch(constants.UPDATE_BUILD_SUCCESS, container)
        );
    }
};



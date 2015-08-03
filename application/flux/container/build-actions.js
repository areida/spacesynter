'use strict';

import BuildClient from './build-client';
import constants   from '../../constants';

let client = new BuildClient();

export default {
    create(container, file, progress)
    {
        return client.create(container, file)
            .then(
                data => this.dispatch(constants.CREATE_BUILD_SUCCESS, data),
                () => console.warn,
                progress
            );
    }
};



'use strict';

import BuildClient from './build-client';
import constants   from '../../constants';

let client = new BuildClient();

export default {
    create(container, files, progress)
    {
        return client.create(container, files)
            .then(
                data => this.dispatch(constants.CREATE_BUILD_SUCCESS, data),
                error => console.log(error),
                progress
            );
    }
};



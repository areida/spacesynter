'use strict';

import constants   from '../constants';
import buildClient from '../client/build';

export default {
    create(container, files, progress)
    {
        return buildClient.create(container, files)
            .then(
                data => this.dispatch(constants.CREATE_BUILD_SUCCESS, data),
                error => console.log(error),
                progress
            );
    }
};



'use strict';

import authActions      from './flux/auth/auth-actions';
import buildActions     from './flux/container/build-actions';
import containerActions from './flux/container/container-actions';

export default {
    auth      : authActions,
    build     : buildActions,
    container : containerActions
};

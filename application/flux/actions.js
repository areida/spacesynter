'use strict';

import authActions      from './auth/auth-actions';
import buildActions     from './container/build-actions';
import containerActions from './container/container-actions';

export default {
    auth      : authActions,
    build     : buildActions,
    container : containerActions
};

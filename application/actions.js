'use strict';

import authActions      from './action/auth';
import buildActions     from './action/build';
import containerActions from './action/container';

export default {
    auth      : authActions,
    build     : buildActions,
    container : containerActions
};

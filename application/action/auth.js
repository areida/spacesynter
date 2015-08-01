'use strict';

import authClient from '../client/auth';
import constants  from '../constants';

export default {
    login(path)
    {
        if (typeof window !== 'undefined') {
            window.location.href = window.location.origin + '/gh-login' + (path ? '?returnPath=' + path : '');
        }
    },

    logout()
    {
        this.dispatch(constants.LOGOUT);

        return authClient.logout();
    }
};

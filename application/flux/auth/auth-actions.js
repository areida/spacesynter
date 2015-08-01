'use strict';

import AuthClient from './auth-client';
import constants  from '../../constants';

let client = new AuthClient();

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

        return client.logout();
    }
};

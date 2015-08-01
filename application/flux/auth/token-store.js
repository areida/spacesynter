'use strict';

import store from 'store';

import ApiStore  from '../api-store';
import constants from '../../constants';

export default class TokenStore extends ApiStore {
    constructor()
    {
        super();
        this.state = {
           error    : false,
           loading  : false,
           loggedIn : !! store.get('token'),
           token    : store.get('token')
        };

        this.bindActions(
            constants.LOGOUT, 'onLogout'
        );
    }

    onLogout()
    {
        store.remove('token');
        this.state.loggedIn = false;
        this.state.token    = {};

        this.emit('change');
    }

    getTokenData()
    {
        return store.get('token');
    }

    isLoggedIn()
    {
        return this.state.loggedIn;
    }

    setState(state)
    {
        this.state = state;

        if (this.state.token) {
            store.set('token', this.state.token);
        } else {
            store.remove('token');
        }
    }
}

'use strict';

import Store     from 'fluxxor/lib/store';
import Immutable from 'immutable';

export default class ApiStore extends Store {
    constructor()
    {
        let state = new Immutable.Map({
            loaded  : false,
            loading : false
        });

        super();

        this.state = state.merge(this.state);
    }

    isLoading()
    {
        return this.state.get('loading');
    }

    isLoaded()
    {
        return this.state.get('loaded');
    }
}

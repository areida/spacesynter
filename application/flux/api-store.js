'use strict';

import Store from 'fluxxor/lib/store';

export default class ApiStore extends Store {
    constructor()
    {
        super();

        this.loaded  = false;
        this.loading = false;
    }

    isLoaded()
    {
        return this.loaded;
    }

    isLoading()
    {
        return this.loading;
    }
}

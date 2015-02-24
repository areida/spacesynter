'use strict';

class BaseAPIStore {
    isLoading()
    {
        return this.state.loading;
    }

    isLoaded()
    {
        return this.state.loaded;
    }

    isSaving()
    {
        return this.state.saving;
    }

    isSaved()
    {
        return this.state.saved;
    }

    fromObject(object)
    {
        this.state = object;
    }

    toObject()
    {
        return this.state;
    }

}

module.exports = BaseAPIStore;

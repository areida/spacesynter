/* jshint globalstrict: true */
'use strict';

var BaseAPIStore = function () {};

BaseAPIStore.prototype.getState = function()
{
    return this.state;
};

BaseAPIStore.prototype.isLoading = function()
{
    return this.state.loading;
};

BaseAPIStore.prototype.isLoaded = function()
{
    return this.state.loaded;
};

BaseAPIStore.prototype.isSaving = function()
{
    return this.state.saving;
};

BaseAPIStore.prototype.isSaved = function()
{
    return this.state.saved;
};

BaseAPIStore.prototype.setState = function(state)
{
    this.state = state;
};


module.exports = BaseAPIStore;
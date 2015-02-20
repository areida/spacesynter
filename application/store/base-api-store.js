/* jshint globalstrict: true */
'use strict';

var BaseAPIStore = function () {};

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

BaseAPIStore.prototype.fromObject = function(object)
{
    this.state = object;
};

BaseAPIStore.prototype.toObject = function()
{
    return this.state;
};

module.exports = BaseAPIStore;
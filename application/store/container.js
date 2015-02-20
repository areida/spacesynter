/* jshint globalstrict: true */
'use strict';

var constants       = require('../constants');
var APIStoreFactory = require('./api-store-factory');

var ContainerStore = APIStoreFactory.createStore({
    initialize : function()
    {
        this.state = {
            containers : []
        };
    },

    getAll : function()
    {
        return this.state.containers;
    }
});

module.exports = ContainerStore;
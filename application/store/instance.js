/* jshint globalstrict: true */
'use strict';

var constants       = require('../constants');
var APIStoreFactory = require('./api-store-factory');

var InstanceStore = APIStoreFactory.createStore({
    initialize : function()
    {
        this.state = {
            instances : []
        };
    },

    getAll : function()
    {
        return this.state.instances;
    }
});

module.exports = InstanceStore;
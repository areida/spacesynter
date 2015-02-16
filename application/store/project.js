/* jshint globalstrict: true */
'use strict';

var constants       = require('../constants');
var APIStoreFactory = require('./api-store-factory');

var ProjectStore = APIStoreFactory.createStore({
    initialize : function()
    {
        this.state = {
            projects : []
        };
    },

    getAll : function()
    {
        return this.state.projects;
    }
});

module.exports = ProjectStore;
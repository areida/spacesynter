/* jshint globalstrict: true */
'use strict';

var githubClient = require('../client/github');
var constants    = require('../constants');

module.exports = {
    create : function()
    {
        this.dispatch(constants.PROJECT_CREATE);
    },

    destroy : function()
    {
        this.dispatch(constants.PROJECT_REMOVE);
    },

    fetchAll : function()
    {
        this.dispatch(constants.PROJECT_FETCH_ALL);
    }
};



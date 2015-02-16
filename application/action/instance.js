/* jshint globalstrict: true */
'use strict';

var constants = require('../constants');

module.exports = {
    create : function()
    {
        this.dispatch(constants.INSTANCE_CREATE);
    },

    destroy : function()
    {
        this.dispatch(constants.INSTANCE_REMOVE);
    },

    fetchAll : function()
    {
        this.dispatch(constants.INSTANCE_FETCH_ALL);
    },

    reprovision : function()
    {
        this.dispatch(constants.INSTANCE_REPROVISION);
    }
};



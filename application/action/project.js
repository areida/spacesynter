/* jshint globalstrict: true */
'use strict';

var constants = require('../constants');

module.exports = {
    create : function(name, repo)
    {
        var flux = this;

        this.dispatch(constants.PROJECT_CREATE);

        projectClient.create({
            name : name,
            repo : repo
        }).then(
            function (data) {
                flux.dispatch(constants.PROJECT_CREATE_SUCCESS, data);
            }
        );
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



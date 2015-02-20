/* jshint globalstrict: true */
'use strict';

var constants       = require('../constants');
var containerClient = require('../client/container');

module.exports = {
    create : function(container)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_CREATE, container);

        return containerClient.create(container).then(
            function (data) {
                flux.dispatch(constants.CONTAINER_CREATE_SUCCESS, data);
            }
        );
    },

    fetch : function(name)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_FETCH, name);

        return containerClient.fetch(name).then(
            function (response) {
                flux.dispatch(constants.CONTAINER_FETCH_SUCCESS, response);
            }
        );
    },

    fetchAll : function()
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_FETCH_ALL);

        return containerClient.fetchAll().then(
            function (response) {
                flux.dispatch(constants.CONTAINER_FETCH_ALL_SUCCESS, response);
            }
        );
    },

    kill : function(name)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_KILL, name);

        return containerClient.kill(name).then(
            function (response) {
                flux.dispatch(constants.CONTAINER_KILL_SUCCESS, response);
            }
        );
    }
};



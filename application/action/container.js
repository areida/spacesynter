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

    destroy : function(container)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_DESTROY, container);

        return containerClient.destroy(container.id).then(
            function (response) {
                flux.dispatch(constants.CONTAINER_DESTROY_SUCCESS, response);
            }
        );
    },

    fetch : function(container)
    {
        var flux = this;

        this.dispatch(constants.CONTAINER_FETCH_ALL, container);

        return containerClient.fetch(container.id).then(
            function (response) {
                flux.dispatch(constants.CONTAINER_FETCH_ALL_SUCCESS, response);
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
    }
};



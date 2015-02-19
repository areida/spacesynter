/* jshint globalstrict: true */
'use strict';

var constants      = require('../constants');
var instanceClient = require('../client/instance');

module.exports = {
    create : function(name)
    {
        var flux = this;

        this.dispatch(constants.INSTANCE_CREATE, name);

        return instanceClient.create(name).then(
            function (data) {
                flux.dispatch(constants.INSTANCE_CREATE_SUCCESS, data);
            }
        );
    },

    destroy : function(id)
    {
        var flux = this;

        this.dispatch(constants.INSTANCE_DESTROY, id);

        return instanceClient.destroy(id).then(
            function (data) {
                flux.dispatch(constants.INSTANCE_DESTROY_SUCCESS, data);
            }
        );
    },

    fetch : function(id)
    {
        var flux = this;

        this.dispatch(constants.INSTANCE_FETCH_ALL, id);

        return instanceClient.fetch(id).then(
            function (data) {
                flux.dispatch(constants.INSTANCE_FETCH_ALL_SUCCESS, data);
            }
        );
    },

    fetchAll : function()
    {
        var flux = this;

        this.dispatch(constants.INSTANCE_FETCH_ALL, name);

        return instanceClient.fetchAll(name).then(
            function (data) {
                flux.dispatch(constants.INSTANCE_FETCH_ALL_SUCCESS, data);
            }
        );
    }
};



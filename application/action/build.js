'use strict';

var constants   = require('../constants');
var buildClient = require('../client/build');

module.exports = {
    create(container, files, progress)
    {
        var flux = this;

        flux.dispatch(constants.BUILD_CREATE);

        return buildClient.create(container, files)
            .then(
                data => flux.dispatch(constants.BUILD_CREATE_SUCCESS, data),
                error => console.log(error),
                progress
            )
            .done();
    }
};



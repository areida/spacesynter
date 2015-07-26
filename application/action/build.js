'use strict';

var constants   = require('../constants');
var buildClient = require('../client/build');

module.exports = {
    create(container, files, progress)
    {
        this.dispatch(constants.BUILD_CREATE);

        return buildClient.create(container, files)
            .then(
                data => this.dispatch(constants.BUILD_CREATE_SUCCESS, data),
                error => console.log(error),
                progress
            )
            .done();
    }
};



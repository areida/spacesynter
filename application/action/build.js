'use strict';

var constants   = require('../constants');
var buildClient = require('../client/build');

module.exports = {
    create(container, files, progress)
    {
        return buildClient.create(container, files)
            .then(
                data => this.dispatch(constants.CREATE_BUILD_SUCCESS, data),
                error => console.log(error),
                progress
            );
    }
};



'use strict';

var _ = require('lodash');

var defaults, overrides;

defaults = {
    api : {
        hostname : 'spacesynter.vm',
        port     : 8000
    },
    login_url : '/login'
};

switch(__ENVIRONMENT__)
{
    case 'development':
        overrides = require('./config/development');
        break;
    case 'production':
        overrides = require('./config/production');
        break;
    default:
        throw new Error('Invalid ENVIRONMENT value: ' + __ENVIRONMENT__);
}

module.exports = _.merge({}, defaults, overrides);
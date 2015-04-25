'use strict';

var _ = require('lodash');

var defaults, overrides;

defaults = {
    api : {
        port   : 8000
    },
    app : {
        port : 9090
    },
    auth : false,
    dev  : {
        port : 9000
    },
    docker : false,
    github : {
        hostname  : 'api.github.com',
        port      : 443,
        secure    : true,
        userAgent : 'areida/spacesynter'
    },
    nginx : true,
    redis : {
        builds     : {
            host     : 'localhost',
            port     : 6379,
            database : 6
        },
        containers : {
            host     : 'localhost',
            port     : 6379,
            database : 0
        },
        cookies : {
            host     : 'localhost',
            port     : 6379,
            database : 1,
            secret   : 'abcdefghijklmnopqrstuvwxyz1234567890'
        }
    }
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

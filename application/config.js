'use strict';

// __ENVIRONMENT__ is replaced by webpack during build
switch(__ENVIRONMENT__)
{
    case 'ci':
        module.exports = require('./config/ci');
        break;
    case 'development':
        module.exports = require('./config/development');
        break;
    case 'qa':
        module.exports = require('./config/qa');
        break;
    case 'production':
        module.exports = require('./config/production');
        break;
    default:
        throw new Error('Invalid ENVIRONMENT value: ' + __ENVIRONMENT__);
}

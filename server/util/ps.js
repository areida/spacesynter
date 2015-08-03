'use strict';

var pm2       = require('../util/pm2');
var vagrant   = require('../util/vagrant');

var managers  = {
    nodejs : pm2,
    php    : vagrant,
    static : pm2
};

module.exports = {
    delete : function (container) {
        return managers[container.type].delete(container);
    },

    restart : function (container) {
        if (container.status === 'stopped') {
            return managers[container.type].start(container);
        } else {
            return managers[container.type].restart(container);
        }
    },

    start : function (container) {
        return managers[container.type].start(container);
    },

    stop : function (container) {
        return managers[container.type].stop(container);
    }
};
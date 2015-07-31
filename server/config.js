'use strict';

var argv = require('minimist')(process.argv.slice(2), {c : 'config'});
var fs   = require('fs');
var _    = require('lodash');

var config   = {},
    defaults = {
    auth         : false,
    containerDir : process.cwd() + '/__containers__',
    cwd          : process.cwd(),
    hostname     : 'localhost',
    github       : {
        clientId     : process.env.SC_GH_CLIENT_ID,
        clientSecret : process.env.SC_GH_CLIENT_SECRET,
        hostname     : 'api.github.com',
        port         : 443,
        secure       : true,
        userAgent    : 'areida/spacesynter'
    },
    mongoDb : {
        host : 'localhost',
        name : 'spacesynter'
    },
    nginx : true,
    port  : 9090,
    redis : {
        cookies : {
            host     : 'localhost',
            port     : 6379,
            database : 0,
            secret   : 'abcdefghijklmnopqrstuvwxyz1234567890'
        },
        resque : {
            database :  0,
            host     : '127.0.0.1',
            password : '',
            port     :  6379
        }
    }
};

if (argv.config) {
    config = JSON.parse(fs.readFileSync(argv.config));
}

module.exports = _.merge({}, defaults, config);

'use strict';

var fs       = require('fs');
var minimist = require('minimist');
var _        = require('lodash');

var argv, config, defaults;

argv     = minimist(process.argv.slice(2), {c : 'config'});
config   = {};
defaults = {
    auth         : false,
    containerDir : process.cwd() + '/__containers__',
    cwd          : process.cwd(),
    frontend     : {
        host : 'localhost:9090'
    },
    hipache      : false,
    hostname     : 'localhost',
    github       : {
        clientId     : process.env.SC_GH_CLIENT_ID,
        clientSecret : process.env.SC_GH_CLIENT_SECRET,
        hostname     : 'api.github.com',
        orgs         : [],
        port         : 443,
        secure       : true,
        userAgent    : 'areida/spacesynter'
    },
    mongoDb : {
        host : 'localhost',
        name : 'spacesynter'
    },
    nginx : false,
    port  : 9090,
    redis : {
        cookies : {
            host     : 'localhost',
            port     : 6379,
            database : 0,
            secret   : 'abcdefghijklmnopqrstuvwxyz1234567890'
        },
        hipache : {
            database : 1,
            host     : '127.0.0.1',
            port     : 6379
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

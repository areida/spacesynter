'use strict';

var Resque = require('node-resque');

var config = require('./config');
var jobs   = require('./util/jobs');

var worker = new Resque.worker(
    {connection: config.redis.resque, queues: ['nr:nginx']},
    jobs,
    function () {
        console.log('Waiting for jobs');
        worker.workerCleanup();
        worker.start();
    }
);

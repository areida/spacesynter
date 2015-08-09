'use strict';

var express          = require('express');
var graffiti         = require('@risingstack/graffiti');
var graffitiMongoose = require('@risingstack/graffiti-mongoose');
var mongoose         = require('mongoose');

var Container = require('../server/model/container');
var config    = require('../server/config');

mongoose.connect(config.mongoDb.host, config.mongoDb.name);

var app = express();

app.use(graffiti.express({
    adapter : graffitiMongoose,
    models  : [Container],
    prefix  : '/graphql'
}));

app.listen(3000);
'use strict';

var Express = require('express');
var fs      = require('fs');
var path    = require('path');

var app = new Express();

app.get(/^([^.]+)$/, function (req, res) {
    fs.readFile(
        process.env.CWD + '/index.html',
        function (error, file) {
            res.send(file);
        }
    );
});

app.use(Express.static(process.env.CWD + '/build'));

app.listen(process.env.PORT, 10, function () {
    console.log('Listening on localhost:' + process.env.PORT);
});

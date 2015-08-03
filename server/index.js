'use strict';

var CookieParser = require('cookie-parser');
var Express      = require('express');
var fs           = require('fs');
var mongoose     = require('mongoose');
var os           = require('os');
var Session      = require('express-session');
var RedisStore   = require('connect-redis')(Session);
var tmpl         = require('blueimp-tmpl').tmpl;

var config    = require('./config');
var auth      = require('./middleware/auth');
var container = require('./middleware/container');
var github    = require('./middleware/github');

var app, mongoClient;

mongoClient = mongoose.connect(config.mongoDb.host, config.mongoDb.name);

tmpl.load = function (name) {
    return fs.readFileSync(config.cwd + '/templates/' + name, 'utf8');
};

app = new Express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', config.hostname + ':' + config.port);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Filename');
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST');
    next();
});

app.use(new CookieParser());
app.use(new Session({
    resave            : false,
    saveUninitialized : false,
    secret            : config.redis.cookies.secret,
    store             : new RedisStore(config.redis.cookies)
}));

if (config.auth) {
    app.use(github);
    app.use(auth);
}

app.get('/api/stats', function (req, res) {
    res.json({
        arch     : os.arch(),
        freemem  : os.freemem(),
        cpus     : os.cpus(),
        cpuTime  : cpuTime,
        hostname : os.hostname(),
        loadavg  : os.loadavg(),
        platform : os.platform(),
        release  : os.release(),
        totalmem : os.totalmem(),
        type     : os.type(),
        uptime   : os.uptime()
    });
});

app.use('/api', container);

app.get(/^([^.]+)$/, function (req, res) {
    res.send(tmpl('index.html', {}));
});

app.use(Express.static(config.cwd + '/build'));

app.listen(config.port, 10, function () {
    console.log('Listening on localhost:' + config.port);
});

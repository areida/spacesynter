'use strict';

var bodyParser   = require('body-parser');
var Express      = require('express');
var ObjectId     = require('mongoose').Types.ObjectId;
var path         = require('path');
var openport     = require('openport');
var Q            = require('q');
var _            = require('lodash');

var config    = require('../config');
var Container = require('../model/container');
var fs        = require('../util/fs');
var reload    = require('../util/reload');
var ps        = require('../util/ps');

var app = new Express();

app.use(bodyParser.json());

app.disable('etag');

app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json');
    res.header('If-None-Match', '*');
    res.header('Last-Modified', (new Date()).toUTCString());
    next();
});

function buildHostname(name, port) {
    var hostname;

    if (config.hostname === 'localhost') {
        hostname = 'localhost:' + port;
    } else {
        hostname = name + '.' + config.hostname;;
    }

    return hostname;
}

function deleteBackend(container) {
    return ps.delete(container);
}

function deleteFrontend(container) {
    return Q.all([
        ps.delete(container),
        container.remove(),
        fs.rmDir(container),
        reload.exec()
    ]);
}

function findPort(ports) {
    return new Q.promise(
        function (resolve, reject) {
            openport.find(
                {avoid : ports},
                function (error, port) {
                    if (error) reject(error);
                    else resolve(port);
                }
            );
        }
    );
}

function randomHash(length) {
    return Math.random().toString(36).substring(2, length + 2);
}

app.delete(
    '/container/:name',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                if (container) {
                    (
                        (container.type === 'php') ?
                        deleteBackend(container) : deleteFrontend(container)
                    ).done(
                        function () {
                            res.sendStatus(204);
                        },
                        function (error) {
                            res.status(500);
                            res.json(error);
                        }
                    );
                } else {
                    res.status(404);
                    res.json({message : 'Container `' + req.params.name + '` does not exist'});
                }
            }
        );
    }
);

app.delete(
    '/container/:name/build/:build',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                if (container) {
                    var build = _.findWhere(container.builds, {
                        _id : new ObjectId(req.params.build)
                    });

                    if (build) {
                        container.builds = _.reject(
                            container.builds,
                            function (build) {
                                return build._id.toString() === req.params.build;
                            }
                        );

                        Q.all([
                            fs.deleteBuild(container, build),
                            container.save()
                        ]).then(
                            function (responses) {
                                res.json(responses[1].toObject());
                            },
                            function (error) {
                                res.status(500);
                                res.json(error);
                            }
                        );
                    } else {
                        res.status(404);
                        res.json({message : 'Build `' + req.params.build + '` does not exist'});
                    }
                } else {
                    res.status(404);
                    res.json({message : 'Container `' + req.params.name + '` does not exist'});
                }
            }
        );
    }
);

app.get(
    '/container/:name',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                res.json(container.toObject());
            },
            function () {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);

app.get(
    '/containers',
    function (req, res) {
        Container.find({}).exec().then(
            function (containers) {
                res.json(containers);
            }
        );
    }
);

app.patch(
    '/container/:name/build/:build',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                var build = _.findWhere(container.builds, {_id : new ObjectId(req.params.build)});

                if (build) {
                    if (container.build === build._id.toString()) {
                        container.build = null;

                        Q.all([
                            ps.stop(container),
                            container.save()
                        ]).then(
                            function (responses) {
                                res.json(responses[1].toObject());
                            },
                            function (error) {
                                res.status(500);
                                res.json(error);
                            }
                        );
                    } else {
                        container.build = build._id.toString();

                        Q.all([
                            fs.changeBuild(container),
                            container.save()
                        ]).then(
                            function (responses) {
                                return ps.restart(responses[1]);
                            }
                        ).done(
                            function (container) {
                                res.json(container.toObject());
                            },
                            function (error) {
                                res.status(500);
                                res.json(error);
                            }
                        );
                    }
                } else {
                    res.status(404);
                    res.json({message : 'Build `' + req.params.build + '` does not exist'});
                }
            },
            function (error) {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);

app.post(
    '/container',
    function (req, res) {
        var name = req.body.name;

        if (! name || ! name.length) {
            name = randomHash(5);
        } else {
            name = name.replace(/\s/g, '-').toLowerCase();
        }

        Q.all([
            Container.findOne({name : name}).exec(),
            Container.find({}).exec()
        ])
        .then(
            function (responses) {
                var container, ports, suffix;

                if (responses[0]) {
                    name = name + '-' + randomHash(5);
                }

                ports = _.pluck(responses[1], 'port');

                findPort(ports).then(
                    function (port) {
                        var data = {
                            build  : null,
                            builds : [],
                            host   : buildHostname(name, port),
                            name   : name,
                            path   : req.body.path,
                            port   : port,
                            type   : req.body.type
                        };

                        return Q.all([
                            Container.create(data),
                            fs.mkDir(path.join(config.containerDir, name))
                        ]);
                    }
                )
                .then(
                    function (responses) {
                        container = responses[0];

                        return Q.all([
                            fs.mkDir(path.join(config.containerDir, name, '/builds')),
                            fs.mkDir(path.join(config.containerDir, name, '/working')),
                            reload.exec()
                        ]);
                    }
                )
                .done(
                    function () {
                        res.json(container.toObject());
                    },
                    function (error) {
                        res.status(500);
                        res.json(error);
                    }
                );
            }
        );
    }
);

// Capture any uploaded file in a buffer
app.post(
    '/container/:name/build',
    function (req, res, next) {
        var data = new Buffer('');

        req.on('data', function (chunk) {
            data = Buffer.concat([data, chunk]);
        });

        req.on('end', function () {
            req.rawBody = data;
            next();
        });
    }
);

app.post(
    '/container/:name/build',
    function (req, res) {
        var filename = req.headers['x-filename'];

        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                if (container) {
                    container.builds.push({
                        name : filename
                    });

                    container.save().then(
                        function (container) {
                            var filepath = path.join(
                                config.containerDir,
                                container.name,
                                'builds',
                                _.last(container.builds)._id.toString()
                            );

                            return fs.saveFile(filepath, req.rawBody);
                        }
                    ).then(
                        function () {
                            res.json(container.toObject());
                        },
                        function (error) {
                            res.status(500);
                            res.json(error);
                        }
                    );
                } else {
                    res.status(404);
                    res.json({message : 'Container `' + req.params.name + '` does not exist'});
                }
            }
        );
    }
);

module.exports = app;

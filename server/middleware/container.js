'use strict';

var bodyParser = require('body-parser');
var exec       = require('child_process').exec;
var Express    = require('express');
var fs         = require('fs');
var ObjectId   = require('mongoose').Types.ObjectId;
var pm2        = require('pm2');
var openport   = require('openport');
var Q          = require('q');
var _          = require('lodash');

var config    = require('../config');
var Container = require('../model/container');
var reload    = require('../util/reload');

var container = new Express();

container.use(bodyParser.json());

container.disable('etag');

container.use(function(req, res, next) {
    res.header('Content-Type', 'application/json');
    res.header('If-None-Match', '*');
    res.header('Last-Modified', (new Date()).toUTCString());
    next();
});


function buildHostname(name, port) {
    return name + '.' + config.hostname + (config.hostname === 'localhost' ? ':' + port : '');
}

function changeBuild(name, build) {
    var command = (
        'rm -rf ' + config.containerDir + '/' + name +
        '/working/* && unzip ' + config.containerDir + '/' + name +
        '/builds/' + build +
        ' -d ' + config.containerDir + '/' + name +
        '/working > /dev/null'
    );

    return new Q.promise(
        function (resolve, reject) {
            exec(
                command,
                function (error) {
                    if (error) reject(error);

                    resolve();
                }
            );
        }
    );
}

function createDirectory(dir) {
    return new Q.promise(
        function (resolve, reject) {
            fs.mkdir(dir, function (error) {
                if (error) reject(error);

                resolve();
            });
        }
    );
}

function deleteBuild(name, build) {
    return new Q.promise(
        function (resolve, reject) {
            var path = config.containerDir + '/' + name + '/builds/' + build;

            fs.unlink(path, function (error) {
                if (error) reject(error);

                resolve();
            });
        }
    );
}

function deleteFolder(name) {
    return new Q.promise(
        function (resolve, reject) {
            exec(
                'rm -rf ' + config.containerDir + '/' + name,
                function (error) {
                    if (error) reject(error);

                    resolve();
                }
            );
        }
    );
}

function deleteProcess(name) {
    return new Q.promise(
        function (resolve, reject) {
            pm2.connect(
                function (error) {
                    if (error) reject(error);

                    pm2.delete(
                        name,
                        function () {
                            resolve();
                        }
                    );
                }
            );
        }
    );
}

function findPort(ports) {
    return new Q.promise(
        function (resolve, reject) {
            openport.find(
                {avoid : ports},
                function (error, port) {
                    if (error) reject(error);

                    resolve(port);
                }
            );
        }
    );
}

function randomHash(length) {
    return Math.random().toString(36).substring(2, length + 2);
}

function restartProcess(container, port) {
    var cwd, script;

    if (container.type === 'static') {
        script = process.cwd() + '/server/static.js';
        cwd    = config.containerDir + '/' + container.name + '/working/' + container.path;
    } else {
         script = (
            config.containerDir + '/' +
            container.name + '/working/' + container.path
        );

         cwd = config.containerDir + '/' + container.name + '/working';
    }

    return new Q.promise(
        function (resolve, reject) {
            pm2.connect(
                function (error) {
                    if (error) reject(error);

                    pm2.start(
                        {
                            env : {
                                APP_ENV : 'qa',
                                CWD     : cwd,
                                PORT    : port
                            },
                            name   : container.name,
                            script : script
                        },
                        function(error) {
                            if (error) reject(error);

                            resolve();
                        }
                    );
                }
            );
        }
    );
}

function saveBuild(name, build, file) {
    return new Q.promise(
        function (resolve, reject) {
            var filepath = (
                config.containerDir + '/' +
                name + '/builds/' + build
            );

            fs.writeFile(
                filepath,
                file,
                function (error) {
                    if (error) reject(error);

                    resolve();
                }
            );
        }
    );
}

container.delete(
    '/container/:name',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                if (container) {
                    Q.all([
                        Container.findByIdAndremove(container._id).exec(),
                        deleteFolder(container.name),
                        deleteProcess(container.name),
                        reload.exec()
                    ]).done(
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

container.delete(
    '/container/:name/build/:build',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                if (container) {
                    var build, objectId;

                    objectId = new ObjectId(req.params.build);
                    build    = _.findWhere(container.builds, {_id : objectId});

                    if (build) {
                        container.builds = _.reject(
                            container.builds,
                            function (build) {
                                return build._id === objectId;
                            }
                        );

                        deleteBuild(container.name, build.name).then(
                            function () {
                                return container.save();
                            }
                        ).done(
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


container.get(
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

container.get(
    '/containers',
    function (req, res) {
        Container.find({}).exec().then(
            function (containers) {
                res.json(containers);
            }
        );
    }
);

container.patch(
    '/container/:name',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                var build = _.findWhere(container.builds, {_id : new ObjectId(req.body.build)});

                if (build) {
                    if (container.build === build.id) {
                        container.build = null;

                        Q.all([
                            container.save(),
                            deleteProcess(container.name)
                        ]).done(
                            function () {
                                res.json(container.toObject());
                            },
                            function (error) {
                                res.status(500);
                                res.json(error);
                            }
                        );
                    } else {
                        container.build = build._id;

                        Q.all([
                            changeBuild(container.name, build.name),
                            container.save()
                        ]).then(
                            function () {
                                return restartProcess(container, container.port);
                            }
                        ).done(
                            function () {
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
                    res.json({message : 'Build `' + req.body.build + '` does not exist'});
                }
            },
            function (error) {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);

container.post(
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
                        var host = this.buildHostname(name, port);
                        var data = {
                            build  : null,
                            builds : [],
                            host   : host,
                            name   : name,
                            path   : req.body.path,
                            port   : port,
                            type   : req.body.type
                        };

                        return ;
                        return Q.all([
                            Container.create(data),
                            createDirectory(config.containerDir + '/' + name)
                        ]);
                    }
                )
                .then(
                    function (responses) {
                        container = responses[0];

                        return Q.all([
                            createDirectory(config.containerDir + '/' + name + '/builds'),
                            createDirectory(config.containerDir + '/' + name + '/working'),
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
container.post(
    '/container/:name/(build|cookbooks)',
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

container.post(
    '/container/:name/build',
    function (req, res) {
        var filename = req.headers['x-filename'];

        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                if (container) {
                    if (_.findWhere(container.builds, {name : filename})) {
                        var suffix = '-' + randomHash(5);

                        filename = filename.replace(/\.zip$/, suffix + '.zip');
                    }

                    container.builds.push({
                        name : filename
                    });

                    Q.all([
                        saveBuild(container.name, filename, req.rawBody),
                        container.save()
                    ]).done(
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

container.post(
    '/container/:name/cookbooks',
    function (req, res) {
        Container.findOne({name : req.params.name}).exec().then(
            function (container) {
                if (container) {
                    if (_.findWhere(container.builds, {name : filename})) {
                        var suffix = '-' + randomHash(5);

                        filename = filename.replace(/\.zip$/, suffix + '.zip');
                    }

                    container.builds.push({
                        name : filename
                    });

                    Q.all([
                        saveBuild(container.name, filename, req.rawBody),
                        container.save()
                    ]).done(
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

module.exports = container;

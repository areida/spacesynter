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
var nginx     = require('../util/nginx');

var container = new Express();

container.use(bodyParser.json());

container.disable('etag');

container.use(function(req, res, next) {
    res.header('Content-Type', 'application/json');
    res.header('If-None-Match', '*');
    res.header('Last-Modified', (new Date()).toUTCString());
    next();
});

var manager = {
    buildHostname : function (name, port) {
        return name + '.' + config.hostname + (config.hostname === 'localhost' ? ':' + port : '');
    },
    changeBuild : function (name, build) {
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
    },
    createContainer : function (name, path, port, type) {
        var host = this.buildHostname(name, port);

        return new Q.promise(
            function (resolve, reject) {
                var container = new Container({
                    build  : null,
                    builds : [],
                    host   : host,
                    name   : name,
                    path   : path,
                    port   : port,
                    type   : type
                });

                container.save(
                    function () {
                        resolve(container);
                    }
                );

            }
        );
    },
    createDirectory : function (dir) {
        return new Q.promise(
            function (resolve, reject) {
                fs.mkdir(dir, function (error) {
                    if (error) reject(error);

                    resolve();
                });
            }
        );
    },
    deleteBuild : function (name, build) {
        return new Q.promise(
            function (resolve, reject) {
                var path = config.containerDir + '/' + name + '/builds/' + build;

                fs.unlink(path, function (error) {
                    if (error) reject(error);

                    resolve();
                });
            }
        );
    },
    deleteContainer : function (name) {
        return Container.remove({name : name}).exec();
    },
    deleteFolder : function (name) {
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
    },
    deleteProcess : function (name) {
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
    },
    findPort : function (ports) {
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
    },
    findContainer : function (name) {
        return new Q.promise(
            function (resolve, reject) {
                Container.find({name : name}).exec().then(
                    function (containers) {
                        if (containers.length) {
                            resolve(containers[0]);
                        } else {
                            reject();
                        }
                    }
                );
            }
        );
    },
    randomHash : function (length) {
        return Math.random().toString(36).substring(2, length + 2);
    },
    restartProcess : function (container, port) {
        var script = (
            config.containerDir + '/' +
            container.name + '/working/' + container.path
        );

        return new Q.promise(
            function (resolve, reject) {
                if (container.type !== 'nodejs') {
                    resolve();
                } else {
                    pm2.connect(
                        function (error) {
                            if (error) reject(error);

                            pm2.start({
                                env : {
                                    APP_ENV : 'qa',
                                    CWD     : config.containerDir + '/' + container.name + '/working',
                                    PORT    : port
                                },
                                name   : container.name,
                                script : script
                            }, function(error) {
                                if (error) reject(error);

                                resolve();
                            });
                        }
                    );
                }
            }
        );
    },
    saveBuild : function (name, build, file) {
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
    },
    saveContainer : function (container) {
        return new Q.promise(
            function (resolve, reject) {
                container.save(
                    function () {
                        resolve();
                    }
                );
            }
        );
    }
};

container.delete(
    '/container/:name',
    function (req, res) {
        manager.findContainer(req.params.name).done(
            function (container) {
                Q.all([
                    manager.deleteContainer(container.name),
                    manager.deleteFolder(container.name),
                    manager.deleteProcess(container.name),
                    nginx.reload()
                ]).done(
                    function () {
                        res.sendStatus(204);
                    },
                    function (error) {
                        res.status(500);
                        res.json(error);
                    }
                );
            },
            function () {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);

container.delete(
    '/container/:name/build/:build',
    function (req, res) {

        manager.findContainer(req.params.name).then(
            function (container) {
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

                    manager.deleteBuild(container.name, build.name).then(
                        function () {
                            return manager.saveContainer(container);
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
            },
            function () {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);


container.get(
    '/container/:name',
    function (req, res) {
        manager.findContainer(req.params.name).done(
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
        manager.findContainer(req.params.name).done(
            function (container) {
                var build = _.findWhere(container.builds, {_id : new ObjectId(req.body.build)});

                if (build) {
                    if (container.build === build.id) {
                        container.build = null;

                        Q.all([
                            manager.saveContainer(container),
                            manager.deleteProcess(container.name)
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
                            manager.changeBuild(container.name, build.name),
                            manager.saveContainer(container)
                        ]).then(
                            function () {
                                return manager.restartProcess(container, container.port);
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
            name = manager.randomHash(5);
        } else {
            name = name.replace(/\s/g, '-').toLowerCase();
        }

        Q.all([
            Container.find({name : name}).exec(),
            Container.find({}).exec()
        ])
        .then(
            function (responses) {
                var container, ports, suffix;

                if (responses[0].length) {
                    name = name + '-' + manager.randomHash(5);
                }

                ports = _.pluck(responses[1], 'port');

                manager.findPort(ports).then(
                    function (port) {
                        return Q.all([
                            manager.createContainer(name, req.body.path, port, req.body.type),
                            manager.createDirectory(config.containerDir + '/' + name)
                        ]);
                    }
                )
                .then(
                    function (responses) {
                        container = responses[0];

                        return Q.all([
                            manager.createDirectory(config.containerDir + '/' + name + '/builds'),
                            manager.createDirectory(config.containerDir + '/' + name + '/working'),
                            nginx.reload()
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

container.post(
    '/container/:name/build',
    function (req, res) {
        var filename = req.headers['x-filename'];

        manager.findContainer(req.params.name).then(
            function (container) {
                if (_.findWhere(container.builds, {name : filename})) {
                    var suffix = '-' + manager.randomHash(5);

                    filename = filename.replace(/\.zip$/, suffix + '.zip');
                }

                container.builds.push({
                    name : filename
                });

                Q.all([
                    manager.saveBuild(container.name, filename, req.rawBody),
                    manager.saveContainer(container)
                ]).done(
                    function () {
                        res.json(container.toObject());
                    },
                    function (error) {
                        res.status(500);
                        res.json(error);
                    }
                );
            },
            function () {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);

module.exports = container;

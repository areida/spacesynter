var exec       = require('child_process').exec;
var Express    = require('express');
var fs         = require('fs');
var pm2        = require('pm2');
var portfinder = require('portfinder');
var Q          = require('q');
var _          = require('lodash');

var config    = require('../config');
var Container = require('../model/container');
var nginx     = require('../util/nginx');

var container = new Express();

var manager = {
    changeBuild : function(name, build) {
        var command = (
            'rm -rf ' + config.app.containerDir + '/' + name +
            '/working/* && unzip ' + config.app.containerDir + '/' + name +
            '/builds/' + build +
            ' -d ' + config.app.containerDir + '/' + name +
            '/working'
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
    createContainer : function (name, port) {
        return new Q.promise(
            function (resolve, reject) {
                var container = new Container({
                    build  : null,
                    builds : [],
                    host   : name + '.' + config.app.hostname,
                    name   : name,
                    port   : port
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
                var path = config.app.containerDir + '/' + name + '/builds/' + build;

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
                    'rm -rf ' + config.app.containerDir + '/' + name,
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
    findPort : function () {
        return new Q.promise(
            function (resolve, reject) {
                portfinder.getPort(
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
    restartProcess : function (name, port) {
        var script = (
            config.app.containerDir + '/' +
            name + '/working/server/index.js'
        );

        return new Q.promise(
            function (resolve, reject) {
                pm2.connect(
                    function (error) {
                        if (error) reject(error);

                        pm2.start({
                            env : {
                                APP_ENV : 'qa',
                                CWD     : config.app.containerDir + '/' + name + '/working',
                                PORT    : port
                            },
                            name   : name,
                            script : script
                        }, function(error, proc) {
                            if (error) reject(error);

                            resolve();
                        });
                    }
                );
            }
        );
    },
    saveBuild : function (name, build, file) {
        return new Q.promise(
            function (resolve, reject) {
                var filepath = (
                    config.app.containerDir + '/' +
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

// Capture any uploaded file in a buffer
container.use(
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

container.delete(
    '/container/:name',
    function (req, res) {
        manager.findContainer(req.params.name).done(
            function (container) {
                Q.all([
                    manager.deleteContainer(container.name),
                    manager.deleteFolder(container.name),
                    manager.deleteProcess(container.name)
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
                container.build = req.body.build;

                Q.all([
                    manager.changeBuild(container.name, req.body.build),
                    manager.restartProcess(container.name, container.port),
                    nginx.reload()
                ]).then(
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
        manager.findContainer(req.body.name).done(
            function (container) {
                res.status(422);
                res.json({message : 'Container \'' + container.name + '\' already exists'});
            },
            function () {
                var container;

                manager.findPort().then(
                    function (port) {
                        return Q.all([
                            manager.createContainer(req.body.name, port),
                            manager.createDirectory(config.app.containerDir + '/' + req.body.name)
                        ]);
                    }
                )
                .then(
                    function (responses) {
                        container = responses[0];

                        return Q.all([
                            manager.createDirectory(config.app.containerDir + '/' + req.body.name + '/builds'),
                            manager.createDirectory(config.app.containerDir + '/' + req.body.name + '/working')
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

container.delete(
    '/container/:name/build',
    function (req, res) {
        manager.findContainer(req.params.name).then(
            function (container) {
                if (_.findWhere(container.builds, {name : req.query.name})) {
                    container.builds = _.reject(
                        container.builds,
                        function (build) {
                            return build.name === req.query.name;
                        }
                    );
                    manager.deleteBuild(container.name, req.query.name).then(
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
                    res.json({message : 'Build `' + req.query.name + '` does not exist'});
                }
            },
            function () {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);

container.post(
    '/container/:name/build',
    function (req, res) {
        manager.findContainer(req.params.name).then(
            function (container) {
                if (_.findWhere(container.builds, {name : req.query.name})) {
                    res.status(422);
                    res.json({message : 'Build `' + req.query.name + '` already exists'});
                } else {
                    manager.saveBuild(container.name, req.query.name, req.rawBody).then(
                        function () {
                            container.builds.push({
                                name : req.query.name
                            });

                            container.save(
                                function () {
                                    res.json(container.toObject());
                                }
                            );
                        },
                        function (error) {
                            res.status(500);
                            res.json(error);
                        }
                    );
                }
            },
            function () {
                res.status(404);
                res.json({message : 'Container `' + req.params.name + '` does not exist'});
            }
        );
    }
);

module.exports = container;

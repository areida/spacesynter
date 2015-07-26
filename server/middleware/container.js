var exec       = require('child_process').exec;
var Express    = require('express');
var fs         = require('fs');
var pm2        = require('pm2');
var portfinder = require('portfinder');
var Q          = require('q');
var _          = require('lodash');

var config    = require('../config');
var Container = require('../model/container');
var docker    = require('../util/docker');
var nginx     = require('../util/nginx');

var container = new Express();

var manager = {
    changeBuild : function(name, build) {
        var command = (
            'rm -rf __containers__/' + name +
            '/working/* && unzip __containers__/' + name +
            '/builds/' + build +
            ' -d __containers__/' + name +
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
                        manager.createDirectory('__containers__/' + name).then(
                            function () {
                                Q.all([
                                    manager.createDirectory('__containers__/' + name + '/builds'),
                                    manager.createDirectory('__containers__/' + name + '/working')
                                ]).done(
                                    function () {
                                        resolve(container);
                                    },
                                    reject
                                );
                            },
                            reject
                        );
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
    deleteContainer : function (name) {
        return Container.remove({name : name}).exec();
    },
    deleteFolder : function (name) {
        return new Q.promise(
            function (resolve, reject) {
                exec(
                    'rm -rf ' + process.cwd() + '/__containers__/' + name,
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
            process.cwd() + '/__containers__/' +
            name + '/working/server/index.js'
        );

        return new Q.promise(
            function (resolve, reject) {
                pm2.connect(
                    function (error) {
                        if (error) reject(error);

                        pm2.start({
                            env    : {PORT : port},
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
                    process.cwd() + '/__containers__/' +
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
};

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
                    function () {
                        res.sendStatus(500);
                    }
                );
            },
            function () {
                res.sendStatus(404);
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
                res.sendStatus(404);
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
                Q.all([
                    manager.changeBuild(container.name, req.body.build),
                    manager.restartProcess(container.name, container.port),
                    nginx.reload()
                ]).done(
                    function () {
                        container.build = req.body.build;
                        container.save(
                            function () {
                                res.json(container.toObject());
                            }
                        );
                    },
                    function () {
                        res.sendStatus(500);
                    }
                );
            },
            function (error) {
                req.sendStatus(404);
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
                manager.findPort().then(
                    function (port) {
                        return manager.createContainer(req.body.name, port);
                    },
                    function () {
                        res.sendStatus(500);
                    }
                ).done(
                    function (container) {
                        res.json(container.toObject());
                    },
                    function () {
                        res.sendStatus(500);
                    }
                );
            }
        );
    }
);

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
                        function () {
                            req.sendStatus(500);
                        }
                    );
                }
            },
            function () {
                res.sendStatus(404);
            }
        );
    }
);

module.exports = container;

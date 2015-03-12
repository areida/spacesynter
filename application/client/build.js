/* global FileReader, Uint8Array, XMLHttpRequest */
'use strict';

var Q = require('q');

var config = require('../config').api;

class BuildClient {

    create(container, files)
    {
        return Q.promise(
            function (resolve, reject, notify) {
                if (files[0].type !== 'application/zip') {
                    reject();
                }

                if (typeof FileReader !== 'undefined') {
                    var reader = new FileReader();
                    var xhr    = new XMLHttpRequest();

                    xhr.upload.addEventListener('progress', function (event) {
                        if (event.lengthComputable) {
                            notify(Math.round((event.loaded * 100) / event.total));
                        }
                    }, false);

                    xhr.upload.addEventListener('load', function (event) {
                        resolve(event);
                    }, false);

                    xhr.open(
                        'POST',
                        'http://' + config.hostname + ':' + config.port + '/container/' + container.get('name') + '/build?name=' + files[0].name
                    );

                    xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');

                    reader.onload = function(event) {
                        if (! xhr.sendAsBinary) {
                            xhr.sendAsBinary = function(dataString) {
                                var ords = Array
                                    .prototype
                                    .map
                                    .call(dataString, function byteValue(x) {
                                        return x.charCodeAt(0) & 0xff;
                                    });

                                this.send(new Uint8Array(ords));
                            };
                        }

                        xhr.sendAsBinary(event.target.result);
                    };

                    console.log('Loading file: ', files[0]);
                    reader.readAsBinaryString(files[0]);
                }
            }
        );
    }
}

module.exports = new BuildClient();

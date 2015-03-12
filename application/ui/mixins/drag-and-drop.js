/* global console, FileReader, Uint8Array, XMLHttpRequest */
'use strict';

var config = require('../../config');

module.exports = {

    onDrop(files, progress)
    {
        var component = this;

        if (files[0].type !== 'application/zip') {
            return;
        }

        if (typeof FileReader !== 'undefined') {
            var reader = new FileReader();
            var xhr    = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', function (event) {
                if (event.lengthComputable) {
                    var percent = Math.round((event.loaded * 100) / event.total);

                    component.setState({uploadPercent : percent});
                }
            }, false);

            xhr.upload.addEventListener('load', function (event) {
                component.setState({
                    dragActive    : false,
                    uploadPercent : 0
                });
            }, false);

            xhr.open(
                'POST',
                'http://' + config.api.hostname + ':' + config.api.port + '/container/' + this.props.container.get('name') + '/build?name=' + files[0].name
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
};
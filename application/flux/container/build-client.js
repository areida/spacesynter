/* global FileReader, Uint8Array, XMLHttpRequest */
/* jshint bitwise: false */
'use strict';

import Q from 'q';

import {api} from '../../config';

export default class BuildClient {
    create(container, files)
    {
        return Q.promise(
            (resolve, reject, notify) => {
                if (! files.length || files[0].type !== 'application/zip') {
                    reject();
                }

                if (typeof FileReader !== 'undefined') {
                    let reader = new FileReader();
                    let xhr    = new XMLHttpRequest();

                    xhr.upload.addEventListener(
                        'progress',
                        event => {
                            if (event.lengthComputable) {
                                notify(Math.round((event.loaded * 100) / event.total));
                            }

                        },
                        false
                    );

                    xhr.upload.addEventListener('load', () => {notify(0);}, false);

                    xhr.addEventListener(
                        'load',
                        () => {
                            if (xhr.status === 200) {
                                resolve(JSON.parse(xhr.response));
                            } else {
                                reject(xhr);
                            }
                        }
                    );

                    xhr.open(
                        'POST',
                        (
                            'http://' + api.hostname + ':' + api.port + api.prefix +
                            '/container/' + container.get('name') + '/build'
                        )
                    );

                    xhr.setRequestHeader(
                        'X-Filename',
                        files[0].name.replace(/\s/g, '-').toLowerCase()
                    );

                    xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');

                    reader.onload = (event) => {
                        if (! xhr.sendAsBinary) {
                            xhr.sendAsBinary = (dataString) => {
                                this.send(
                                    new Uint8Array(
                                        Array.prototype.map.call(
                                            dataString,
                                            x => (x.charCodeAt(0) & 0xff)
                                        )
                                    )
                                );
                            };
                        }

                        xhr.sendAsBinary(event.target.result);
                    };

                    reader.readAsBinaryString(files[0]);
                }
            }
        );
    }
}

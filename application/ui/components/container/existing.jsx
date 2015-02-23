/* jshint globalstrict: true */
/* global console, FileReader, Uint8Array, XMLHttpRequest */
'use strict';

var React     = require('react');
var FluxMixin = require('fluxxor').FluxMixin(React);

var config = require('../../../config');
var Button = require('../buttons/button');
var Upload = require('../form/inputs/upload');

module.exports = React.createClass({
    displayName : 'ExistingContainer',

    mixins : [FluxMixin],

    getInitialState : function()
    {
        return {
            percent : 0
        };
    },

    onDrop: function (files, progress)
    {
        var component = this;

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
                component.setState({uploadPercent : 100});
            }, false);
            
            xhr.open('POST', 'http://' + config.api.hostname + ':' + config.api.port + '/upload/' + this.props.container.get('name'));
            
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
    },

    onKill : function()
    {
        this.getFlux().actions.container.kill(this.props.container.get('name'));
    },

    render : function()
    {
        return (
            <div className='container existing row'>
                <div className='medium-2 columns'>
                    <p>{this.props.container.get('name')}</p>
                </div>
                <div className='medium-2 columns'>
                    <p>{this.props.container.get('host')}</p>
                </div>
                <div className='medium-2 columns' title='Click or Drag Build Here'>
                    <Upload onDrop={this.onDrop} percent={this.state.uploadPercent}>Add Build</Upload>
                </div>
                <div className='medium-6 columns'>
                    <Button size='small'>
                        <a onDoubleClick={this.onKill}>Kill</a>
                    </Button>
                </div>
            </div>
        );
    }

});

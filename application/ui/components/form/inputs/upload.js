'use strict';

var React = require('react');
var cx    = require('react/lib/cx');

var Upload = React.createClass({

    displayName : 'Upload',

    propTypes : {
        onDrop : React.PropTypes.func.isRequired,
        percent: React.PropTypes.number,
        size   : React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.numeber]),
        style  : React.PropTypes.object
    },

    getDefaultProps : function()
    {
        return {
            percent : 0,
            size    : '100%'
        };
    },

    getInitialState : function()
    {
        return {
            dragActive : false
        };
    },

    onClick : function()
    {
        this.refs.fileInput.getDOMNode().click();
        this.setState({
            dragActive : true
        });
    },

    onDragLeave : function()
    {
        this.setState({
            dragActive : false
        });
    },

    onDragOver : function(event)
    {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

        this.setState({
            dragActive : true
        });
    },

    onDrop : function(event)
    {
        var files;

        event.preventDefault();

        this.setState({
            dragActive : false
        });

        if (event.dataTransfer) {
            files = event.dataTransfer.files;
        } else if (event.target) {
            files = event.target.files;
        }

        if (this.props.onDrop) {
            this.props.onDrop(files);
        }
    },

    render : function()
    {
        var background, classes, style;

        background = (
            '-webkit-linear-gradient(' +
                'left, ' +
                'green ' + this.props.percent  + '%, ' +
                'white ' + this.props.percent  + '%' +
            ')'
        );

        classes = cx({
            active   : this.state.dragActive,
            dropzone : true,
        });

        style = {
            background  : background,
            borderStyle : (this.state.dragActive || this.props.percent)  ? 'solid' : 'dashed',
            borderWidth : 5,
            height      : this.props.size,
            width       : this.props.size
        };

        return (
            <div
                className   = {classes}
                onClick     = {this.onClick}
                onDragLeave = {this.onDragLeave}
                onDragOver  = {this.onDragOver}
                onDrop      = {this.onDrop}
                style       = {this.props.style || style}
            >
                <input
                    multiple = 'multiple'
                    onChange = {this.onDrop}
                    ref      = 'fileInput'
                    style    = {{display : 'none' }}
                    type     = 'file'
                />
                {this.props.children}
            </div>
        );
    }
});

module.exports = Upload;

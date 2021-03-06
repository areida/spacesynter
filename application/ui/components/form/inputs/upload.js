'use strict';

import React      from 'react';
import classNames from 'classnames';

class Upload extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            dragActive : false
        };
    }

    onClick()
    {
        this.refs.fileInput.getDOMNode().click();
        this.setState({
            dragActive : true
        });
    }

    onDragLeave()
    {
        this.setState({
            dragActive : false
        });
    }

    onDragOver(event)
    {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';

        this.setState({
            dragActive : true
        });
    }

    onDrop(event)
    {
        let files;

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
    }

    render()
    {
        let background, classes, style;

        background = (
            '-webkit-linear-gradient(' +
                'left, ' +
                'green ' + this.props.percent  + '%, ' +
                'white ' + this.props.percent  + '%' +
            ')'
        );

        classes = {
            active   : this.state.dragActive,
            dropzone : true
        };

        style = {
            background  : background,
            borderStyle : (this.state.dragActive || this.props.percent)  ? 'solid' : 'dashed',
            borderWidth : 5,
            height      : this.props.size,
            width       : this.props.size
        };

        return (
            <div
                className   = {classNames(classes)}
                onClick     = {this.onClick.bind(this)}
                onDragLeave = {this.onDragLeave.bind(this)}
                onDragOver  = {this.onDragOver.bind(this)}
                onDrop      = {this.onDrop.bind(this)}
                style       = {this.props.style || style}
            >
                <input
                    onChange = {this.onDrop.bind(this)}
                    ref      = 'fileInput'
                    style    = {{display : 'none' }}
                    type     = 'file'
                />
                {this.props.children}
            </div>
        );
    }
}

Upload.displayName = 'Upload';

Upload.propTypes = {
    onDrop  : React.PropTypes.func.isRequired,
    percent : React.PropTypes.number,
    size    : React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.numeber
    ]),
    style : React.PropTypes.object
};

Upload.defaultProps = {
    percent : 0,
    size    : '100%'
};

export default Upload;

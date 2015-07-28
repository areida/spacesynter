'use strict';

var React = require('react');

var Button = require('./buttons/button');

class Build extends React.Component {
    renderDelete()
    {
        if (this.props.active) {
            return null;
        }

        return (
            <Button
                size     = 'tiny'
                onClick  = {this.props.onDelete}
                disabled = {this.props.active}
                color    = 'primary'
            >
                <a>Delete</a>
            </Button>
        );
    }
    render()
    {
        return (
            <div className='row'>
                <div className='medium-2 columns'>&nbsp;</div>
                <div className='medium-2 columns'>{this.props.name}</div>
                <div className='medium-2 columns'>{this.props.created}</div>
                <div className='medium-2 columns'>
                    <Button
                        size    = 'tiny'
                        onClick = {this.props.onActivate}
                        color   = {this.props.active ? 'secondary' : 'primary'}
                    >
                        <a>{this.props.active ? 'Deactivate' : 'Activate'}</a>
                    </Button>
                </div>
                <div className='medium-2 columns'>
                    {this.renderDelete()}
                </div>
                <div className='medium-2 columns'></div>
            </div>
        );
    }
}

Build.displayName = 'Build';
Build.propTypes   = {
    active     : React.PropTypes.bool.isRequired,
    created    : React.PropTypes.string.isRequired,
    name       : React.PropTypes.string.isRequired,
    onActivate : React.PropTypes.func.isRequired,
    onDelete   : React.PropTypes.func.isRequired
};

module.exports = Build;
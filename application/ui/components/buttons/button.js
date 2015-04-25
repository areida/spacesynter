'use strict';

var React      = require('react');
var classNames = require('classnames');

class Button extends React.Component {
    render()
    {
        var classes = {
            'button'              : true,
            'button--tiny'        : this.props.size === 'tiny',
            'button--small'       : this.props.size === 'small',
            'button--medium'      : this.props.size === 'medium',
            'button--large'       : this.props.size === 'large',
            'button--auto'        : this.props.display === 'auto',
            'button--primary'     : this.props.color === 'primary',
            'button--secondary'   : this.props.color === 'secondary',
            'button--tertiary'    : this.props.color === 'tertiary',
            'button--inherit'     : this.props.color === 'inherit',
            'button--warning'     : this.props.status === 'warning',
            'button--warning-alt' : this.props.status === 'warning-alt',
            'button--positive'    : this.props.status === 'positive',
            'button--split-left'  : this.props.split === 'left',
            'button--split-right' : this.props.split === 'right',
            'button--block'       : this.props.block === true,
            'button-disabled'     : this.props.disabled === true
        };

        return (
            <span
                className     = {classNames(classes)}
                onClick       = {this.props.onClick}
                onDoubleClick = {this.props.onDoubleClick}
            >
                {this.props.children}
            </span>
        );
    }
}

Button.displayName = 'Button';
Button.propTypes   = {
    size : React.PropTypes.oneOf([
        'tiny',
        'small',
        'medium',
        'large',
        'auto',
        'default'
    ]),
    display : React.PropTypes.oneOf([
        'auto',
        'default'
    ]),
    color : React.PropTypes.oneOf([
        'primary',
        'secondary',
        'tertiary',
        'inherit'
    ]),
    status : React.PropTypes.oneOf([
        'warning',
        'warning-alt',
        'positive',
        null
    ]),
    split : React.PropTypes.oneOf([
        'left',
        'right',
        null
    ]),
    block         : React.PropTypes.bool,
    disabled      : React.PropTypes.bool,
    onClick       : React.PropTypes.func,
    onDoubleClick : React.PropTypes.func,
};

Button.defaultProps = {
    size          : 'default',
    color         : 'primary',
    status        : null,
    split         : null,
    expand        : false,
    disabled      : false,
    onClick       : null,
    onDoubleClick : null
};

module.exports = Button;
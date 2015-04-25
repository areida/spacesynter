'use strict';

var React     = require('react');
var Link      = require('react-router').Link;
var classNames  = require('classnames');

module.exports = React.createClass({
    displayName : 'StyleGuideNavItem',

    propTypes : {
        active      : React.PropTypes.bool,
        displayName : React.PropTypes.string
    },

    getDefaultProps : function()
    {
        return {
            active      : false,
            displayName : ''
        };
    },

    render : function()
    {
        var classes, params, to;

        classes = {
            'sg-nav__menu-link'             : true,
            'sg-nav__menu-link--is-current' : this.props.active
        };

        params = this.props.displayName ? {section : this.props.displayName} : {};
        to     = this.props.displayName ? 'style-guide-section' : 'style-guide';

        return (
            <li className='sg-nav__menu-item'>
                <Link
                    to        = {to}
                    params    = {params}
                    className = {classNames(classes)}
                    onClick   = {this.onClick}
                >
                    {this.props.children || this.props.displayName}
                </Link>
            </li>
        );
    }

});

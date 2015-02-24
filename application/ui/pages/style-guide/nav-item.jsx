'use strict';

var React     = require('react');
var FluxMixin = require('fluxxor').FluxMixin(React);
var Link      = require('react-router').Link;
var classSet  = require('react/lib/cx');

module.exports = React.createClass({
    displayName : 'StyleGuideNavItem',

    mixins : [FluxMixin],

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
        var linkClasses, linkParams, linkTo;

        linkClasses = classSet({
            'sg-nav__menu-link'             : true,
            'sg-nav__menu-link--is-current' : this.props.active
        });

        linkParams = this.props.displayName ? {section : this.props.displayName} : {};
        linkTo     = this.props.displayName ? 'style-guide-section' : 'style-guide';

        return (
            <li className='sg-nav__menu-item'>
                <Link
                    to        = {linkTo}
                    params    = {linkParams}
                    className = {linkClasses}
                    onClick   = {this.onClick} >
                    {this.props.children || this.props.displayName}
                </Link>
            </li>
        );
    }

});

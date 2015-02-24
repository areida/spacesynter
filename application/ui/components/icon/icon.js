'use strict';

var React = require('react');
var cx    = require('react/lib/cx');
var _     = require('underscore');

var iconMap = {
    caret   : require('./icons/caret'),
    navicon : require('./icons/navicon')
};

module.exports = React.createClass({
    displayName : 'Icon',

    propTypes : {
        icon : React.PropTypes.oneOf(_.keys(iconMap)),
        size : React.PropTypes.oneOf([
            'default',
            'x-large',
            'large',
            'medium',
            'small',
            'x-small'
        ]),
        rotate : React.PropTypes.oneOf([
            0,
            45,
            90,
            180,
            270
        ]),
        color : React.PropTypes.oneOf([
            'white',
            'black',
            'primary',
            'secondary',
            'tertiary'
        ])
    },

    getDefaultProps : function()
    {
        return {
            size   : 'default',
            rotate : 0,
            color  : 'black'
        };
    },

    render : function()
    {
        var classes,
            Component;

        classes = cx({
            'icon'             : true,
            'icon--x-large'    : this.props.size   === 'x-large',
            'icon--large'      : this.props.size   === 'large',
            'icon--medium'     : this.props.size   === 'medium',
            'icon--small'      : this.props.size   === 'small',
            'icon--x-small'    : this.props.size   === 'x-small',
            'icon--rotate-0'   : this.props.rotate === 0,
            'icon--rotate-45'  : this.props.rotate === 45,
            'icon--rotate-90'  : this.props.rotate === 90,
            'icon--rotate-180' : this.props.rotate === 180,
            'icon--rotate-270' : this.props.rotate === 270,
            'icon--white'      : this.props.color  === 'white',
            'icon--black'      : this.props.color  === 'black',
            'icon--primary'    : this.props.color  === 'primary',
            'icon--secondary'  : this.props.color  === 'secondary',
            'icon--tertiary'   : this.props.color  === 'tertiary'
        });

        Component = iconMap[this.props.icon];

        return (
            <span className={'icon--' + this.props.icon + ' ' + classes}>
                <Component />
            </span>
        );
    }
});

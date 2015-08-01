'use strict';

import React      from 'react';
import classNames from 'classnames';
import _          from 'lodash';

const ICONS = {
    caret   : require('./icons/caret'),
    navicon : require('./icons/navicon')
};

class Icon extends React.Component {
    render()
    {
        let classes, Component;

        classes = {
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
        };

        classes['icon--' + this.props.icon] = true;

        Component = ICONS[this.props.icon];

        return (
            <span className={classNames(classes)}>
                <Component />
            </span>
        );
    }
}

Icon.displayName = 'Icon';

Icon.propTypes = {
    icon : React.PropTypes.oneOf(_.keys(ICONS)),
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
};

Icon.defaultProps = {
        size   : 'default',
        rotate : 0,
        color  : 'black'
};

export default Icon;
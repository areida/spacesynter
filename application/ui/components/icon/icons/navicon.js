'use strict';

var React = require('react');

class Navicon extends React.Component {
    render()
    {
        return (
            <svg xmlns='http://www.w3.org/2000/svg' version='1.1' x='0px' y='0px' viewBox='0 0 25 25' enable-background='new 0 0 25 25'>
                <g>
                    <path d='M24.5 3.5v2c0 0.3-0.1 0.5-0.3 0.7s-0.4 0.3-0.7 0.3h-22C1.2 6.5 1 6.4 0.8 6.2C0.6 6 0.5 5.8 0.5 5.5v-2 c0-0.3 0.1-0.5 0.3-0.7C1 2.6 1.2 2.5 1.5 2.5h22c0.3 0 0.5 0.1 0.7 0.3C24.4 3 24.5 3.2 24.5 3.5z M24.5 11.5v2 c0 0.3-0.1 0.5-0.3 0.7s-0.4 0.3-0.7 0.3h-22c-0.3 0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.4-0.3-0.7v-2c0-0.3 0.1-0.5 0.3-0.7 c0.2-0.2 0.4-0.3 0.7-0.3h22c0.3 0 0.5 0.1 0.7 0.3S24.5 11.2 24.5 11.5z M24.5 19.5v2c0 0.3-0.1 0.5-0.3 0.7 c-0.2 0.2-0.4 0.3-0.7 0.3h-22c-0.3 0-0.5-0.1-0.7-0.3c-0.2-0.2-0.3-0.4-0.3-0.7v-2c0-0.3 0.1-0.5 0.3-0.7c0.2-0.2 0.4-0.3 0.7-0.3 h22c0.3 0 0.5 0.1 0.7 0.3S24.5 19.2 24.5 19.5z' />
                </g>
            </svg>
        );
    }
}

Navicon.displayName = 'RocketIcon';

module.exports = Navicon;
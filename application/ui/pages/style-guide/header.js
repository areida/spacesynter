'use strict';

var React     = require('react');
var SGNavItem = require('./nav-item');

module.exports = React.createClass({

    displayName : 'StyleGuideHeader',

    propTypes : {
        // Component constructors for sections
        activeSection : React.PropTypes.string,
        sections      : React.PropTypes.arrayOf(React.PropTypes.func)
    },

    renderNavItems : function()
    {
        var activeSection = this.props.activeSection;

        return this.props.sections.map(function(Page) {
            return (
                <SGNavItem
                    displayName = {Page.displayName}
                    key         = {Page.displayName}
                    active      = {activeSection === Page.displayName}
                />
            );
        });
    },

    render : function()
    {
        return (
            <div className='sg-header'>
                <h1 className='sg-header__title'>
                    <span className='sg-branding'>
                        <svg className='sg-branding__svg' version='1.1' xmlns='http://www.w3.org/2000/svg'x='0px' y='0px' viewBox='0 0 542.8 210.1' enable-background='new 0 0 542.8 210.1'>
                            <g>
                                <path d='M54.1,27.5c-5.1-2.2-10.3-3.3-15.7-3.3c-1.5,0-2.9,0.2-4.3,0.6c-1.4,0.4-2.7,1-3.9,1.8
                                    c-1.2,0.8-2.1,1.9-2.9,3.3c-0.7,1.4-1.1,3.1-1.1,5.1c0,2.5,1,4.5,3.1,5.9c2.1,1.4,5.3,3,9.7,4.6c3.2,1.3,6,2.4,8.1,3.4
                                    c2.2,1,4.3,2.4,6.2,4.1c2,1.7,3.6,3.8,4.8,6.4c1.2,2.5,1.8,5.6,1.8,9.2c0,4.1-0.8,7.6-2.3,10.6c-1.5,3-3.6,5.5-6.2,7.3
                                    c-2.7,1.8-5.7,3.2-9.2,4.1c-3.5,0.9-7.2,1.3-11.3,1.3c-3.5,0-6.5-0.2-8.7-0.6c-2.3-0.4-5.4-1-9.4-2l-1.7-0.4L12.7,75
                                    c2.7,1.5,5.6,2.6,8.6,3.5c3,0.8,6,1.3,8.9,1.3c3.4,0,6.5-0.9,9.4-2.6c2.9-1.7,4.3-4.2,4.3-7.4c0-2.9-1.1-5.1-3.3-6.6
                                    c-2.2-1.5-5.6-3.2-10.2-5c-3.1-1.3-5.7-2.4-7.9-3.4c-2.1-1-4.2-2.4-6.1-4c-1.9-1.7-3.5-3.7-4.6-6.2c-1.2-2.5-1.8-5.4-1.8-8.9
                                    c0-4.1,0.7-7.7,2.2-10.7c1.5-3,3.5-5.5,6-7.4c2.5-1.9,5.4-3.3,8.6-4.1c3.2-0.9,6.6-1.3,10.2-1.3c6.8,0,12.9,0.9,18.5,2.8
                                    L54.1,27.5z'/>
                                <path d='M103,60.1L74.8,13.4H93l18.2,32.4l18.6-32.4h16.4l-27.7,46.7v30.5H103V60.1z'/>
                                <path d='M165,13.4h19l29.4,57.7h0.2V13.4h14.8v77.2h-18.9l-29.5-57.7h-0.2v57.7H165V13.4z'/>
                                <path d='M277.4,13.4h17.5l30.3,77.2H308l-6.6-17.7h-31.3l-6.7,17.7h-16L277.4,13.4z M285.9,28.9h-0.2l-11.2,31.9
                                    h22.6L285.9,28.9z'/>
                                <path d='M343.8,13.4h19.6c4.5,0,8.6,0.4,12.4,1.1c3.8,0.7,7.2,2,10.2,3.8c3,1.8,5.3,4.2,7,7.2
                                    c1.7,3.1,2.5,6.8,2.5,11.2c0,4.4-0.8,8.1-2.3,11.3c-1.5,3.2-3.6,5.7-6.2,7.7c-2.7,2-5.8,3.4-9.4,4.3c-3.6,0.9-7.6,1.3-11.8,1.3
                                    h-6.5v29.3h-15.5V13.4z M359.2,49.1h5.4c4.4,0,8-0.9,10.7-2.7c2.7-1.8,4-4.7,4-8.8c0-4.2-1.4-7.3-4.1-9.2
                                    c-2.7-1.9-6.3-2.9-10.6-2.9h-5.4V49.1z'/>
                                <path d='M458,27.5c-5.1-2.2-10.3-3.3-15.7-3.3c-1.5,0-2.9,0.2-4.3,0.6c-1.4,0.4-2.7,1-3.9,1.8
                                    c-1.2,0.8-2.1,1.9-2.9,3.3c-0.7,1.4-1.1,3.1-1.1,5.1c0,2.5,1,4.5,3.1,5.9c2.1,1.4,5.3,3,9.7,4.6c3.2,1.3,6,2.4,8.1,3.4
                                    c2.2,1,4.3,2.4,6.2,4.1c2,1.7,3.6,3.8,4.8,6.4c1.2,2.5,1.8,5.6,1.8,9.2c0,4.1-0.8,7.6-2.3,10.6c-1.5,3-3.6,5.5-6.3,7.3
                                    c-2.7,1.8-5.7,3.2-9.2,4.1c-3.5,0.9-7.2,1.3-11.3,1.3c-3.5,0-6.5-0.2-8.7-0.6c-2.3-0.4-5.4-1-9.4-2l-1.7-0.4l1.4-13.9
                                    c2.7,1.5,5.6,2.6,8.6,3.5c3,0.8,6,1.3,8.9,1.3c3.4,0,6.5-0.9,9.4-2.6c2.9-1.7,4.3-4.2,4.3-7.4c0-2.9-1.1-5.1-3.3-6.6
                                    c-2.2-1.5-5.6-3.2-10.2-5c-3.1-1.3-5.7-2.4-7.9-3.4c-2.1-1-4.2-2.4-6.1-4c-1.9-1.7-3.5-3.7-4.6-6.2c-1.2-2.5-1.8-5.4-1.8-8.9
                                    c0-4.1,0.7-7.7,2.2-10.7c1.5-3,3.5-5.5,6-7.4c2.5-1.9,5.4-3.3,8.6-4.1c3.2-0.9,6.6-1.3,10.2-1.3c6.8,0,12.9,0.9,18.5,2.8L458,27.5
                                    z'/>
                                <path d='M486.4,13.4H532v12.2h-30.1v19h27.5v12.2h-27.5v21.7h30.3v12.2h-45.8V13.4z'/>
                            </g>
                            <g>
                                <path d='M54.1,133.7c-5.1-2.2-10.3-3.3-15.7-3.3c-1.5,0-2.9,0.2-4.3,0.6c-1.4,0.4-2.7,1-3.9,1.8
                                    c-1.2,0.8-2.1,1.9-2.9,3.3c-0.7,1.4-1.1,3.1-1.1,5.1c0,2.5,1,4.5,3.1,5.9c2.1,1.4,5.3,3,9.7,4.6c3.2,1.3,6,2.4,8.1,3.4
                                    c2.2,1,4.3,2.4,6.2,4.1c2,1.7,3.6,3.8,4.8,6.4c1.2,2.5,1.8,5.6,1.8,9.2c0,4.1-0.8,7.6-2.3,10.6c-1.5,3-3.6,5.5-6.2,7.3
                                    c-2.7,1.8-5.7,3.2-9.2,4.1c-3.5,0.9-7.2,1.3-11.3,1.3c-3.5,0-6.5-0.2-8.7-0.6c-2.3-0.4-5.4-1-9.4-2l-1.7-0.4l1.4-13.9
                                    c2.7,1.5,5.6,2.6,8.6,3.5c3,0.8,6,1.3,8.9,1.3c3.4,0,6.5-0.9,9.4-2.6c2.9-1.7,4.3-4.2,4.3-7.4c0-2.9-1.1-5.1-3.3-6.6
                                    c-2.2-1.5-5.6-3.2-10.2-5c-3.1-1.3-5.7-2.4-7.9-3.4c-2.1-1-4.2-2.4-6.1-4c-1.9-1.7-3.5-3.7-4.6-6.2c-1.2-2.5-1.8-5.4-1.8-8.9
                                    c0-4.1,0.7-7.7,2.2-10.7c1.5-3,3.5-5.5,6-7.4c2.5-1.9,5.4-3.3,8.6-4.1c3.2-0.9,6.6-1.3,10.2-1.3c6.8,0,12.9,0.9,18.5,2.8
                                    L54.1,133.7z'/>
                                <path d='M103.8,131.7H81.6v-12.2h59.7v12.2h-22.1v65h-15.5V131.7z'/>
                                <path d='M164.5,119.6H180v44.6c0,6.9,1.3,12.3,3.8,16.1c2.5,3.8,6.6,5.7,12.3,5.7c5.7,0,9.8-1.9,12.3-5.7
                                    c2.5-3.8,3.8-9.2,3.8-16.1v-44.6h15.5v49.3c0,10-2.7,17.4-8.1,22.1c-5.4,4.7-13.2,7.1-23.4,7.1c-10.2,0-18-2.4-23.4-7.1
                                    c-5.4-4.7-8.1-12.1-8.1-22.1V119.6z'/>
                                <path d='M253.6,119.6h21.1c6.3,0,12.1,0.6,17.4,1.8c5.3,1.2,10,3.3,14,6.2c4.1,2.9,7.3,6.9,9.6,11.9
                                    c2.3,5.1,3.5,11.3,3.5,18.6c0,7.4-1.2,13.6-3.5,18.6c-2.3,5-5.5,9-9.6,11.9c-4.1,2.9-8.8,5-14,6.2c-5.3,1.2-11.1,1.8-17.4,1.8
                                    h-21.1V119.6z M269.1,184.6h8.6c3.2,0,6.4-0.6,9.5-1.8c3.1-1.2,5.8-2.9,8.2-5.2c2.4-2.3,4.3-5.1,5.7-8.4c1.4-3.3,2.1-7,2.1-11.1
                                    c0-4.1-0.7-7.7-2.1-11.1c-1.4-3.3-3.3-6.1-5.7-8.4c-2.4-2.3-5.1-4-8.2-5.2c-3.1-1.2-6.2-1.8-9.5-1.8h-8.6V184.6z'/>
                                <path d='M343,119.6h15.5v77.2H343V119.6z'/>
                                <path d='M394.9,129c6.6-7.2,15.9-10.8,27.9-10.8c6,0,11.3,1,16,2.9c4.7,1.9,8.7,4.6,11.9,8.2
                                    c3.2,3.5,5.7,7.7,7.4,12.6c1.7,4.9,2.5,10.2,2.5,16c0,5.9-0.8,11.3-2.5,16.2c-1.7,4.9-4.1,9.1-7.3,12.7c-3.2,3.6-7.2,6.4-11.9,8.3
                                    c-4.7,2-10.1,2.9-16.1,2.9c-12.1,0-21.4-3.6-28-11c-6.6-7.3-9.8-17-9.8-29.2C385,145.8,388.3,136.2,394.9,129z M402.4,168.3
                                    c0.8,3.3,2.1,6.3,3.8,9c1.7,2.7,4,4.8,6.7,6.3c2.8,1.5,6.1,2.3,9.9,2.3c3.8,0,7.1-0.8,9.9-2.3c2.8-1.5,5-3.7,6.7-6.3
                                    c1.7-2.7,3-5.6,3.8-9c0.8-3.3,1.2-6.8,1.2-10.4c0-3.5-0.4-6.9-1.3-10.2c-0.8-3.3-2.2-6.2-3.9-8.8c-1.8-2.6-4-4.7-6.8-6.2
                                    c-2.8-1.5-6-2.3-9.7-2.3s-6.9,0.8-9.7,2.3c-2.8,1.5-5,3.6-6.8,6.2c-1.8,2.7-3.1,5.6-3.9,8.8c-0.8,3.2-1.3,6.6-1.3,10.2
                                    C401.2,161.6,401.6,165,402.4,168.3z'/>
                                <path d='M526.7,133.7c-5.1-2.2-10.3-3.3-15.7-3.3c-1.5,0-2.9,0.2-4.3,0.6c-1.4,0.4-2.7,1-3.9,1.8
                                    c-1.2,0.8-2.1,1.9-2.9,3.3c-0.7,1.4-1.1,3.1-1.1,5.1c0,2.5,1,4.5,3.1,5.9c2.1,1.4,5.3,3,9.7,4.6c3.2,1.3,6,2.4,8.1,3.4
                                    c2.2,1,4.3,2.4,6.2,4.1c2,1.7,3.6,3.8,4.8,6.4c1.2,2.5,1.8,5.6,1.8,9.2c0,4.1-0.8,7.6-2.3,10.6c-1.5,3-3.6,5.5-6.2,7.3
                                    c-2.7,1.8-5.7,3.2-9.2,4.1c-3.5,0.9-7.2,1.3-11.3,1.3c-3.5,0-6.5-0.2-8.7-0.6c-2.3-0.4-5.4-1-9.4-2l-1.7-0.4l1.4-13.9
                                    c2.7,1.5,5.6,2.6,8.6,3.5c3,0.8,6,1.3,8.9,1.3c3.4,0,6.5-0.9,9.4-2.6c2.9-1.7,4.3-4.2,4.3-7.4c0-2.9-1.1-5.1-3.3-6.6
                                    c-2.2-1.5-5.6-3.2-10.2-5c-3.1-1.3-5.7-2.4-7.9-3.4c-2.1-1-4.2-2.4-6.1-4c-1.9-1.7-3.5-3.7-4.6-6.2c-1.2-2.5-1.8-5.4-1.8-8.9
                                    c0-4.1,0.7-7.7,2.2-10.7c1.5-3,3.5-5.5,6-7.4c2.5-1.9,5.4-3.3,8.6-4.1c3.2-0.9,6.6-1.3,10.2-1.3c6.8,0,12.9,0.9,18.5,2.8
                                    L526.7,133.7z'/>
                            </g>
                        </svg>
                    </span>
                </h1>
                <nav className='sg-nav'>
                    <menu className='sg-nav__menu'>
                    <SGNavItem active={this.props.activeSection === 'all'} displayName='all'>Kitchen Sink</SGNavItem>
                        {this.renderNavItems()}
                    </menu>
                </nav>
            </div>
        );
    }

});

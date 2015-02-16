/* jshint globalstrict: true */
'use strict';

var React  = require('react');

module.exports = React.createClass({
    displayName : 'ExistingProjectBack',

    destroy : function()
    {
        this.getFlux().actions.project.destroy(this.props.project);
        this.props.flip();
    },

    render : function()
    {
        return (
            <div className='back'>
                <div onClick={this.props.flip} className='card__header'>
                    <h2>Actions</h2>
                    <a onClick={this.props.flip} className='card__header--x'>×</a>
                </div>
                <div className='small-12 columns'>
                    <a onDoubleClick={this.destroy} className='button button--block button--tertiary'>Delete (double-click)</a>
                </div>
            </div>
        );
    }

});

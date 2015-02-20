/* jshint globalstrict: true */
'use strict';

var React  = require('react');

module.exports = React.createClass({
    displayName : 'ExistingContainer',

    destroy : function()
    {
        this.getFlux().actions.container.destroy(this.props.container);
    },

    render : function()
    {
        return (
            <div className='container__container-existing'>
                <h2>Actions</h2>
                <p>this.props.container.name</p>
                <a onDoubleClick={this.destroy}>Delete (double-click)</a>
            </div>
        );
    }

});

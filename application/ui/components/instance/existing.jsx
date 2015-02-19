/* jshint globalstrict: true */
'use strict';

var React  = require('react');

module.exports = React.createClass({
    displayName : 'ExistingInstance',

    destroy : function()
    {
        this.getFlux().actions.isntance.destroy(this.props.isntance);
    },

    render : function()
    {
        return (
            <div>
                <h2>Actions</h2>
                <a onDoubleClick={this.destroy}>Delete (double-click)</a>
            </div>
        );
    }

});

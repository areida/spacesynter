/* jshint globalstrict: true */
'use strict';

var React  = require('react');

module.exports = React.createClass({
    displayName : 'ExistingProject',

    destroy : function()
    {
        this.getFlux().actions.project.destroy(this.props.project);
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

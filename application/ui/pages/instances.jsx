/* jshint globalstrict: true */
'use strict';

var React = require('react');

var InstanceList = require('../components/instance-list');

module.exports = React.createClass({
    displayName : 'Instances',

    render : function()
    {
        return (
            <div>
                <InstanceList user={this.props.user} />
            </div>
        );
    }
});

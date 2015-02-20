/* jshint globalstrict: true */
'use strict';

var React = require('react');

var Button = require('../buttons/button');

module.exports = React.createClass({
    displayName : 'ExistingContainer',

    kill : function()
    {
        this.getFlux().actions.container.kill(this.props.container);
    },

    render : function()
    {
        console.log(this.props.container);
        return (
            <div className='container existing row'>
                <div className='medium-2 columns'>
                    <p>{this.props.container.name}</p>
                </div>
                <Button size='small'>
                    <a onDoubleClick={this.kill}>Kill</a>
                </Button>
            </div>
        );
    }

});

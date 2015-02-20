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
        return (
            <div className='container existing row'>
                <div className='medium-2 columns'>
                    <p>{this.props.container.get('name')}</p>
                </div>
                <div className='medium-2 columns'>
                    <p>{this.props.container.get('host')}</p>
                </div>
                <Button size='small'>
                    <a onDoubleClick={this.kill}>Kill</a>
                </Button>
            </div>
        );
    }

});

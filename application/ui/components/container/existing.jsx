/* jshint globalstrict: true */
'use strict';

var React     = require('react');
var FluxMixin = require('fluxxor').FluxMixin(React);

var Button = require('../buttons/button');

module.exports = React.createClass({
    displayName : 'ExistingContainer',

    mixins : [FluxMixin],

    kill : function()
    {
        this.getFlux().actions.container.kill(this.props.container.get('name'));
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

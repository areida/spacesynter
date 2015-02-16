/* jshint globalstrict: true */
'use strict';

var React  = require('react');

module.exports = React.createClass({
    displayName : 'NewInstanceFront',

    render : function()
    {
        return (
            <div className='front' onClick={this.props.flip}>
                <div className='add-instance'>
                    <div className='add-instance__plus' />
                </div>
            </div>
        );
    }

});

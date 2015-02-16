/* jshint globalstrict: true */
'use strict';

var React        = require('react');
var FluxMixin    = require('fluxxor').FluxMixin(React);
var RouteHandler = require('react-router').RouteHandler;

module.exports = React.createClass({
    displayName : 'LoggedOutLayout',

    mixins : [FluxMixin],

    render : function() {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler />
            </div>
        );
    }
});

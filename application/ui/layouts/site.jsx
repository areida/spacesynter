'use strict';

var React        = require('react');
var RouteHandler = require('react-router').RouteHandler;
var FluxMixin    = require('fluxxor').FluxMixin(React);

module.exports = React.createClass({

    displayName : 'SiteLayout',

    mixins : [FluxMixin],

    render()
    {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler />
            </div>
        );
    }
});

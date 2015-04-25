'use strict';

var React          = require('react');
var {RouteHandler} = require('react-router');

class SiteLayout extends React.Component {
    render()
    {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler {...this.props} />
            </div>
        );
    }
}

SiteLayout.displayName = SiteLayout;

module.exports = SiteLayout;
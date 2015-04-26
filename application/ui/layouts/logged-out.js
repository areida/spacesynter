'use strict';

var React          = require('react');
var {RouteHandler} = require('react-router');

class LoggedOutLayout extends React.Component {
    render()
    {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler {...this.props} />
            </div>
        );
    }
}

LoggedOutLayout.displayName = 'LoggedOutLayout';

module.exports = LoggedOutLayout;
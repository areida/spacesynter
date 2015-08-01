'use strict';

var React          = require('react');
var {RouteHandler} = require('react-router');

var config = require('../../config');

class LoggedInLayout extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            loggedIn : props.flux.store('TokenStore').isLoggedIn()
        };
    }

    componentDidMount()
    {
        if (config.auth) {
            this.authenticate();
        }
    }

    componentDidUpdate()
    {
        if (config.auth) {
            this.authenticate();
        }
    }

    authenticate()
    {
        if (! this.state.loggedIn) {
            this.context.router.transitionTo('login');
        }
    }

    render()
    {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler {...this.props} />
            </div>
        );
    }
}

LoggedInLayout.displayName  = 'LoggedInLayout';
LoggedInLayout.contextTypes = {
    router : React.PropTypes.func
};

module.exports = LoggedInLayout;
'use strict';

import React          from 'react';
import {RouteHandler} from 'react-router';

import config from '../../config';

class LoggedInLayout extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            loggedIn : props.flux.store('Token').isLoggedIn()
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

export default LoggedInLayout;
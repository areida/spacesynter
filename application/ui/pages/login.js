'use strict';

import React from 'react';

import Button from '../components/buttons/button';

class Login extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            loggedIn : props.flux.store('Token').isLoggedIn()
        };
    }

    componentDidMount()
    {
        this.authenticate();
    }

    componentDidUpdate()
    {
        this.authenticate();
    }

    authenticate()
    {
        if (this.state.loggedIn) {
            this.context.router.transitionTo('/');
        }
    }

    render()
    {
        return (
            <div className='login'>
                <Button><a href='/gh-login'>Login with GitHub</a></Button>
            </div>
        );
    }
}

Login.displayName  = 'Login';
Login.contextTypes = {
    router : React.PropTypes.func
};

export default Login;
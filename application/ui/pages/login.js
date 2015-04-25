'use strict';

var React = require('react');

var Button = require('../components/buttons/button');

class Login extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            loggedIn : props.flux.store('TokenStore').isLoggedIn()
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

module.exports = Login;
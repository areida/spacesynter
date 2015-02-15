/* jshint globalstrict: true */
'use strict';

var React      = require('react');
var Navigation = require('react-router').Navigation;

var Button    = require('../components/buttons/button');
var TextInput = require('../components/form/inputs/text');

module.exports = React.createClass({

    displayName : 'HomeModule',

    mixins : [Navigation],

    getInitialState : function()
    {
        return {
            username : ''
        };
    },

    onChange : function(value)
    {
        this.setState({username : value});
    },

    onSubmit : function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        this.transitionTo('gists', {username : this.state.username});
    },

    render : function() {
        var style1,
            style2;

        style1 = {
            textAlign  : 'center',
            marginTop  : '200px',
            fontSize   : '80px',
            fontWeight : 'bold'
        };

        style2 = {
            textAlign : 'center',
            fontSize  : '20px'
        };

        return (
            <div>
                <form method='get' action='/gists' onSubmit={this.onSubmit}>
                    <h1 style={style1}>Github Gists</h1>
                    <h2 style={style2}>
                        <TextInput
                            id           = 'username'
                            type         = 'text'
                            initialValue = {this.state.username}
                            onChange     = {this.onChange}
                            placeholder  = 'Username' />
                    </h2>
                    <button type='submit'>Fetch Gists</button>
                </form>
            </div>
        );
    }
});

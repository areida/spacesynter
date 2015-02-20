/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var Button      = require('../buttons/button');
var SelectInput = require('../form/inputs/select');
var TextInput   = require('../form/inputs/text');

module.exports = React.createClass({

    displayName : 'NewContaienr',
    mixins      : [FluxMixin, new StoreWatchMixin('ContainerStore')],

    getInitialState : function()
    {
        return {
            name : ''
        };
    },

    getStateFromFlux : function()
    {
        return {};
    },

    onFormChange : function(value, element)
    {
        var state = this.state;

        state[element.id] = value;

        this.setState(state);
    },

    onSubmit : function(event)
    {
        event.preventDefault();

        this.getFlux().actions.container.create({name : this.state.name});

        this.setState(this.getInitialState());
    },

    render : function()
    {
        return (
            <div>
                <h2>New Container</h2>
                <form className='form new-container-form' onSubmit={this.onSubmit}>
                    <TextInput
                        className    = 'input'
                        type         = 'text'
                        id           = 'name'
                        onChange     = {this.onFormChange}
                        initialValue = {this.state.name}
                    />
                    <Button className='button' type='submit'>
                        <a>Submit</a>
                    </Button>
                </form>
            </div>
        );
    }

});

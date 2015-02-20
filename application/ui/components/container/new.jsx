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
            image : '',
            name  : ''
        };
    },

    getStateFromFlux : function()
    {
        return {};
    },

    onFormChange : function(value, element)
    {
        var state = this.state;

        state[element.props.id] = value;

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
        var buttonStyle, formStyle, inputStyle;

        return (
            <div className='container new row'>
                <form
                    className = 'form new-container-form'
                    onSubmit  = {this.onSubmit}
                    style     = {formStyle}
                >
                    <div className='medium-2 columns'>
                        <TextInput
                            id           = 'name'
                            initialValue = {this.state.name}
                            onChange     = {this.onFormChange}
                            placeholder  = 'Name'
                            size         = 'small'
                            type         = 'text'
                        />
                    </div>
                    <div className='medium-2 columns'>
                        <SelectInput
                            disabled     = {true}
                            id           = 'image'
                            initialValue = {this.state.image}
                            onChange     = {this.onFormChange}
                            options      = {[{text : 'Image', value : null}]}
                        />
                    </div>
                    <Button
                        className = 'button'
                        type      = 'submit'
                        size      = 'small'
                        style     = {buttonStyle}
                    >
                        <a onClick={this.onSubmit}>Create</a>
                    </Button>
                </form>
            </div>
        );
    }
});

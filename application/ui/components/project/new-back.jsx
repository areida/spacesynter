/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var SelectInput = require('../form/inputs/select');
var TextInput   = require('../form/inputs/text');

module.exports = React.createClass({

    displayName : 'NewProjectBack',
    mixins      : [FluxMixin, new StoreWatchMixin('ProjectStore')],

    getInitialState : function()
    {
        return {};
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

        var project = {
            name : this.state.name
        };

        this.getFlux().actions.project.create(project);

        this.setState(this.getInitialState());
        this.props.flip();
    },

    render : function()
    {
        return (
            <div className='back'>
                <div onClick={this.props.flip} className='card__header'>
                    <h2>New Project</h2>
                    <a onClick={this.props.flip} className='card__header--x'>×</a>
                </div>
                <form className='form new-instance-form' onSubmit={this.onSubmit}>
                    <div className='small-12 columns'>
                        <div>
                            <div className='form__input'>
                            <TextInput
                                className    = 'input'
                                type         = 'text'
                                id           = 'projectName'
                                onChange     = {this.onFormChange}
                                initialValue = {this.state.projectName} />
                                <span className='validate__field-error'>×</span>
                                <span className='validate__field-message'>Please enter an instance name.</span>
                            </div>
                        </div>
                    </div>
                    <div className='small-5 columns'>
                        <div className='space-remaining'>
                            <span className='space-remaining__interger'>8</span><span className='space-remaining-unit'>GB</span>
                            <p>remaining</p>
                        </div>
                    </div>
                    <div className='small-7 columns'>
                        <button onClick={this.onSubmit} className='button' type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        );
    }

});

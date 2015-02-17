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
                    <span className='card__header--x'>×</span>
                </div>
                <form className='form new-project-form' onSubmit={this.onSubmit}>
                    <TextInput
                        className    = 'input'
                        type         = 'text'
                        id           = 'projectName'
                        onChange     = {this.onFormChange}
                        initialValue = {this.state.projectName} />
                    <Button className='button' type='submit'>
                        <a>Submit</a>
                    </Button>
                </form>
            </div>
        );
    }

});

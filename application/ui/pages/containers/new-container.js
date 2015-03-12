'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var Button = require('../../components/buttons/button');
var Select = require('../../components/form/inputs/select');
var Text   = require('../../components/form/inputs/text');

module.exports = React.createClass({

    displayName : 'NewContainer',
    mixins      : [FluxMixin, new StoreWatchMixin('ContainerStore')],

    getInitialState()
    {
        return {
            image : '',
            name  : ''
        };
    },

    getStateFromFlux()
    {
        return {};
    },

    componentDidMount()
    {
        this.getFlux().store('ContainerStore').addListener('created', this.onCreated);
    },

    componentWillUnmount()
    {
        this.getFlux().store('ContainerStore').removeListener('created'. this.onCreated);
    },

    onCreated()
    {
        this.setState(this.getInitialState());
    },

    onFormChange(value, element)
    {
        var state = this.state;

        state[element.props.id] = value;

        this.setState(state);
    },

    onSubmit(event)
    {
        event.preventDefault();

        this.getFlux().actions.container.create({name : this.state.name});
    },

    render()
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
                        <Text
                            id           = 'name'
                            initialValue = {this.state.name}
                            onChange     = {this.onFormChange}
                            placeholder  = 'Name'
                            size         = 'small'
                            type         = 'text'
                        />
                    </div>
                    <div className='medium-2 columns'>
                        <Select
                            disabled     = {true}
                            id           = 'image'
                            initialValue = {this.state.image}
                            onChange     = {this.onFormChange}
                            options      = {[{text : 'Image', value : null}]}
                        />
                    </div>
                    <div className='medium-8 columns'>
                        <Button
                            className = 'button'
                            type      = 'submit'
                            size      = 'small'
                            style     = {buttonStyle}
                        >
                            <a onClick={this.onSubmit}>Create</a>
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
});

/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var Button = require('../buttons/button');
var Select = require('../form/inputs/select');
var Text   = require('../form/inputs/text');
var Upload = require('../form/inputs/upload');

module.exports = React.createClass({

    displayName : 'NewContainer',
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

    onDrop: function (files)
    {
        console.log('Received files: ', files);
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
        var buttonStyle, formStyle, inputStyle, uploadStyle;

        uploadStyle = {
            textAlign : 'center'
        };

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
                    <div className='medium-2 columns' style={uploadStyle}>
                        <Upload onDrop={this.onDrop}>Add Build</Upload>
                    </div>
                    <div class='medium-2 columns'>
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

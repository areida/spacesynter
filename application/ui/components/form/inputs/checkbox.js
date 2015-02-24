'use strict';

var React           = require('react');
var Label           = require('../label');

module.exports = React.createClass({

    displayName : 'CheckboxInput',

    propTypes : {
        id      : React.PropTypes.string.isRequired,
        checked : React.PropTypes.bool.isRequired,
        value   : React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired,
        label    : React.PropTypes.string,
        onChange : React.PropTypes.func
    },

    getInitialState : function()
    {
        return {
            isChecked : this.props.checked
        };
    },

    onChange : function(event)
    {
        var currentValue = event.currentTarget.value;

        this.setState({isChecked : ! this.state.isChecked});

        if (this.props.onChange) {
            this.props.onChange(currentValue);
        }
    },

    render : function()
    {
        return (
            <div className='input-wrap input-wrap--checkbox'>
                <Label
                    className = 'input-wrap__lable'
                    htmlFor   = {this.props.id} >
                    <input
                        className = 'checkbox'
                        id        = {this.props.id}
                        value     = {this.props.value}
                        name      = {this.props.id}
                        type      = 'checkbox'
                        checked   = {this.state.isChecked}
                        onChange  = {this.onChange} />
                    <span className='checkbox-text'>{this.props.label}</span>
                </Label>
            </div>
        );
    }

});

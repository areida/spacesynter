/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var _               = require('underscore');
var Label           = require('../label');
var Icon            = require('../../icon/icon');
var InputValidation = require('../input-validation');
var FormInputsMixin = require('./form-inputs-mixin');

module.exports = React.createClass({

    displayName : 'SelectInputElement',

    mixins : [FormInputsMixin],

    propTypes : {
        id                : React.PropTypes.string.isRequired,
        label             : React.PropTypes.string,
        onChange          : React.PropTypes.func,
        options           : React.PropTypes.arrayOf(
            React.PropTypes.shape({
                value      : React.PropTypes.oneOfType([
                    React.PropTypes.number,
                    React.PropTypes.string,
                    React.PropTypes.bool
                ]),
                text       : React.PropTypes.string,
                isSelected : React.PropTypes.bool
            })
        ),
        validationDisplay : React.PropTypes.string,
        validation        : React.PropTypes.shape({
            text  : React.PropTypes.string,
            value : React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.number
            ])
        }),
        value : React.PropTypes.any
    },

    getDefaultProps : function()
    {
        return {
            label             : null,
            onChange          : null,
            options           : null,
            validationDisplay : null,
            validation        : {}
        };
    },

    renderLabel : function()
    {
        if (! this.props.label) {
            return null;
        }

        return (
            <Label
                htmlFor   = {this.props.id}
                className = 'input-wrap__label'
                text      = {this.props.label} />
        );
    },

    renderSelectOptions : function()
    {
        var selectOptions = [],
            selected;

        if (! this.props.options) {
            return this.props.children;
        }

        this.props.options.map(function(option, index) {
            selected = option.isSelected ? 'selected' : '';

            selectOptions.push(
                <option
                    value      = {option.value}
                    isSelected = {selected}
                    key        = {'select-option-' + index} >
                    {option.text}
                </option>
            );
        });

        return selectOptions;
    },

    getSelectedValue : function()
    {
        var selectedOption;

        if (! _.isUndefined(this.props.value)) {
            return this.props.value;
        }

        selectedOption = _.findWhere(this.props.options, {isSelected : true});

        if (! selectedOption) {
            return;
        }

        return selectedOption.value;
    },

    render : function()
    {
        return (
            <InputValidation {...this.props}
                validation = {this.props.validation}
                display    = {this.props.validationDisplay} >
                {this.renderLabel()}
                <div className='input-wrap input-wrap--select'>
                    <select
                        className = 'input input--select'
                        id        = {this.props.id}
                        value     = {this.getSelectedValue()}
                        onChange  = {this.onChange} >
                        {this.renderSelectOptions()}
                    </select>
                    <span className='input--select__arrow'>
                        <Icon
                            className = 'input--select__arrow-icon'
                            icon      = 'caret'
                            rotate    = {90} />
                    </span>
                </div>
            </InputValidation>
        );
    }

});
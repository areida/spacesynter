/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var classSet        = require('react/lib/cx');
var Label           = require('../label');
var InputValidation = require('../input-validation');
var FormInputsMixin = require('./form-inputs-mixin');

var stringOrNumber = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]);

module.exports = React.createClass({

    displayName : 'TextInputElement',

    mixins : [FormInputsMixin],

    propTypes : {
        id          : React.PropTypes.string.isRequired,
        label       : React.PropTypes.string,
        onBlur      : React.PropTypes.func,
        onChange    : React.PropTypes.func,
        onKeyDown   : React.PropTypes.func,
        collapse    : React.PropTypes.bool,
        inline      : React.PropTypes.bool,
        placeholder : React.PropTypes.string,
        caption     : React.PropTypes.string,
        size        : React.PropTypes.oneOf([
            'x-small',
            'small',
            'medium',
            'default',
            'large',
            'x-large'
        ]),
        style : React.PropTypes.oneOf([
            'default',
            'underline',
            'block',
            'total',
            null
        ]),
        align        : React.PropTypes.string,
        initialValue : stringOrNumber,
        value        : stringOrNumber,
        type         : React.PropTypes.oneOf([
            'date',
            'datetime',
            'datetime-local',
            'day',
            'email',
            'hidden',
            'month',
            'no-edit',
            'number',
            'password',
            'search',
            'tel',
            'text',
            'url',
            'week'
        ]),
        autoComplete      : React.PropTypes.bool,
        disabled          : React.PropTypes.bool,
        validationDisplay : React.PropTypes.string,
        validation        : React.PropTypes.object
    },

    getDefaultProps : function()
    {
        return {
            label             : null,
            onBlur            : null,
            onChange          : null,
            collapse          : false,
            placeholder       : '',
            caption           : null,
            size              : 'default',
            style             : 'default',
            align             : 'left',
            initialValue      : '',
            type              : 'text',
            autoComplete      : false,
            disabled          : false,
            validationDisplay : null,
            validation        : {}
        };
    },

    onKeyDown : function(event)
    {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(event);
        }
    },

    onBlur : function(event)
    {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    },

    renderLabel : function()
    {
        var labelClasses;

        if (! this.props.label) {
            return null;
        }

        labelClasses = [
            'label--size-' + this.props.size,
            classSet({
                'input-wrap__label' : true
            })
        ].join(' ');

        return (
            <Label
                htmlFor   = {this.props.id}
                className = {labelClasses}
                text      = {this.props.label} />
        );
    },

    renderCaption : function()
    {
        if (! this.props.caption) {
            return null;
        }

        return (
            <div className='input__caption'>
                {this.props.caption}
            </div>
        );
    },

    renderInput : function()
    {
        var inputElementClasses, value;

        inputElementClasses = [
            'input',
            'input--'       + this.props.type,
            'input--size-'  + this.props.size,
            'input--style-' + this.props.style,
            'text-'         + this.props.align,
            classSet({
                'input--collapse' : this.props.collapse,
                'input--inline'   : this.props.inline
            }),
            this.props.className
        ].join(' ');

        value = typeof this.props.value === 'string' ? this.props.value : this.state.inputValue;

        if (this.props.type === 'no-edit') {
            return (
                <div className={inputElementClasses}>
                    <span className='input--no-edit__value'>
                        {this.props.initialValue}
                    </span>
                    <input
                        id          = {this.props.id}
                        name        = {this.props.id}
                        type        = 'hidden'
                        value       = {value} />
                </div>
            );
        }

        return (
            <input
                className    = {inputElementClasses}
                id           = {this.props.id}
                name         = {this.props.id}
                type         = {this.props.type}
                value        = {value}
                placeholder  = {this.props.placeholder}
                onBlur       = {this.onBlur}
                onChange     = {this.onChange}
                onKeyDown    = {this.onKeyDown}
                disabled     = {this.props.disabled}
                autoComplete = {this.props.autoComplete ? 'on' : 'off'}
                ref          = {'input'} />
        );
    },

    render : function()
    {
        return (
            <InputValidation {...this.props}
                validation = {this.props.validation}
                display    = {this.props.validationDisplay} >
                {this.renderLabel()}
                <div className='input-wrap'>
                    {this.renderInput()}
                </div>
                {this.renderCaption()}
            </InputValidation>
        );
    }
});
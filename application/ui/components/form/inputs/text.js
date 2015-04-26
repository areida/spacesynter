'use strict';

var React      = require('react');
var classNames = require('classnames');

var InputValidation = require('../input-validation');
var Label           = require('../label');

class TextInput extends React.Component {
    onBlur(event)
    {
        if (this.props.onBlur) {
            this.props.onBlur(event, this);
        }
    }

    onChange(event)
    {
        if (this.props.onChange) {
            this.props.onChange(event.currentTarget.value, this, event);
        }
    }

    onKeyDown(event)
    {
        if (this.props.onKeyDown) {
            this.props.onKeyDown(event, this);
        }
    }

    renderLabel()
    {
        var classes;

        if (! this.props.label) {
            return null;
        }

        classes = {'input-wrap__label' : true};
        classes['label--size-' + this.props.size] = true;

        return (
            <Label
                htmlFor   = {this.props.id}
                className = {classNames(classes)}
                text      = {this.props.label}
            />
        );
    }

    renderCaption()
    {
        if (! this.props.caption) {
            return null;
        }

        return (
            <div className='input__caption'>
                {this.props.caption}
            </div>
        );
    }

    renderInput()
    {
        var classes;

        classes = [
            'input',
            'input--'       + this.props.type,
            'input--size-'  + this.props.size,
            'input--style-' + this.props.style,
            'text-'         + this.props.align,
            classNames({
                'input--collapse' : this.props.collapse,
                'input--inline'   : this.props.inline
            }),
            this.props.className
        ].join(' ');

        if (this.props.type === 'no-edit') {
            return (
                <div className={classes}>
                    <span className='input--no-edit__value'>
                        {this.props.value}
                    </span>
                    <input
                        id    = {this.props.id}
                        name  = {this.props.id}
                        type  = 'hidden'
                        value = {this.props.value}
                    />
                </div>
            );
        }

        return (
            <input
                className    = {classes}
                id           = {this.props.id}
                name         = {this.props.id}
                type         = {this.props.type}
                value        = {this.props.value}
                placeholder  = {this.props.placeholder}
                onBlur       = {this.onBlur.bind(this)}
                onChange     = {this.onChange.bind(this)}
                onKeyDown    = {this.onKeyDown.bind(this)}
                disabled     = {this.props.disabled}
                autoComplete = {this.props.autoComplete ? 'on' : 'off'}
                ref          = {'input'}
            />
        );
    }

    render()
    {
        return (
            <InputValidation {...this.props}
                validation = {this.props.validation}
                display    = {this.props.validationDisplay}
            >
                {this.renderLabel()}
                <div className='input-wrap'>
                    {this.renderInput()}
                </div>
                {this.renderCaption()}
            </InputValidation>
        );
    }
}

TextInput.propTypes = {
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
    align : React.PropTypes.string,
    type  : React.PropTypes.oneOf([
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
    value : React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    autoComplete      : React.PropTypes.bool,
    disabled          : React.PropTypes.bool,
    validationDisplay : React.PropTypes.string,
    validation        : React.PropTypes.object
};

TextInput.defaultProps = {
    label             : null,
    onBlur            : null,
    onChange          : null,
    collapse          : false,
    placeholder       : '',
    caption           : null,
    size              : 'default',
    style             : 'default',
    align             : 'left',
    type              : 'text',
    value             : '',
    autoComplete      : false,
    disabled          : false,
    validationDisplay : null,
    validation        : {}
};

TextInput.displayName = 'TextInputElement';

module.exports = TextInput;
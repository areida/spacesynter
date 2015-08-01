'use strict';

var React = require('react');

var Icon            = require('../../icon/icon');
var InputValidation = require('../input-validation');
var Label           = require('../label');

class SelectInput extends React.Component {
    onChange(event)
    {
        if (this.props.onChange) {
            this.props.onChange(event.currentTarget.value, this, event);
        }
    }

    renderLabel()
    {
        if (! this.props.label) {
            return null;
        }

        return (
            <Label
                htmlFor   = {this.props.id}
                className = 'input-wrap__label'
                text      = {this.props.label}
            />
        );
    }

    renderSelectOptions()
    {
        if (! this.props.options) {
            return this.props.children;
        }

        return this.props.options.map(
            (item, index) => (
                <option
                    value = {item.value}
                    key   = {index}
                >
                    {item.text}
                </option>
            )
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
                <div className='input-wrap input-wrap--select'>
                    <select
                        className = 'input input--select'
                        id        = {this.props.id}
                        value     = {this.props.value}
                        onChange  = {this.onChange.bind(this)}
                        disabled  = {this.props.disabled ? 'disabled' : ''}
                    >
                        {this.renderSelectOptions()}
                    </select>
                    <span className='input--select__arrow'>
                        <Icon
                            className = 'input--select__arrow-icon'
                            icon      = 'caret'
                            rotate    = {90}
                        />
                    </span>
                </div>
            </InputValidation>
        );
    }
}

SelectInput.displayName = 'SelectInputElement';

SelectInput.propTypes = {
    id       : React.PropTypes.string.isRequired,
    disabled : React.PropTypes.bool,
    label    : React.PropTypes.string,
    onChange : React.PropTypes.func,
    options  : React.PropTypes.arrayOf(
        React.PropTypes.shape({
            value : React.PropTypes.oneOfType([
                React.PropTypes.number,
                React.PropTypes.string,
                React.PropTypes.bool
            ]),
            text : React.PropTypes.string
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
};

SelectInput.defaultProps = {
    disabled          : false,
    label             : null,
    onChange          : null,
    options           : null,
    validationDisplay : null,
    validation        : {}
};

module.exports = SelectInput;

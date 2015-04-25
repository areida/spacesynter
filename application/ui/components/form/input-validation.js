'use strict';

var React      = require('react');
var classNames = require('classnames');

class InputValidation extends React.Component {
    renderValidation()
    {
        var classes, messages;

        if (! this.props.validation.messages) {
            return null;
        }

        classes = {
            'validation__msg'          : true,
            'input-wrap__msg'          : true,
            'validation__msg--error'   : this.props.validation.status === 'error',
            'validation__msg--warning' : this.props.validation.status === 'warning',
            'validation__msg--success' : this.props.validation.status === 'success'
        };

        messages = this.props.validation.messages.map(
            (message, index) => (
                <span
                    className = {classNames(classes)}
                    key       = {'validation-msg-' + index} >
                    {message}
                </span>
            )
        );

        return (
            <div className='validation__msgs'>
                {messages}
            </div>
        );
    }

    render()
    {
        var classes = {
            'validation'             : true,
            'validation--visible'    : this.props.validation && this.props.validation.status,
            'validation--error'      : this.props.validation && this.props.validation.status === 'error',
            'validation--warning'    : this.props.validation && this.props.validation.status === 'warning',
            'validation--success'    : this.props.validation && this.props.validation.status === 'success',
            'validation--positioned' : this.props.validation && this.props.display === 'positioned'
        };

        return (
            <div className={classNames(classes)} id={null}>
                {this.props.children}
                {this.renderValidation()}
            </div>
        );
    }
}

InputValidation.displayName = 'InputValidation';

InputValidation.propTypes = {
    display    : React.PropTypes.oneOf(['default', 'positioned']),
    validation : React.PropTypes.shape({
        status   : React.PropTypes.oneOf(['error', 'warning', 'success']),
        messages : React.PropTypes.array
    })
};

InputValidation.defaultProps = {
    display    : 'default',
    validation : {
        status   : null,
        messages : null
    }
};

module.exports = InputValidation;
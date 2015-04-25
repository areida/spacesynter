'use strict';

var React = require('react');

class Label extends React.Component {
    render()
    {
        return (
            <label
                className = 'label'
                htmlFor   = {this.props.htmlFor}
            >
                {this.props.text}
                {this.props.children}
            </label>
        );
    }
}

Label.displayName = 'Label';

Label.propTypes = {
    htmlFor : React.PropTypes.string.isRequired,
    text    : React.PropTypes.string
};

Label.defaultProps = {
    text : null
};

module.exports = Label;
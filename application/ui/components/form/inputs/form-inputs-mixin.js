/* jshint globalstrict: true */
'use strict';

module.exports = {

    getInitialState : function()
    {
        return {
            inputValue : this.props.initialValue
        };
    },

    componentWillReceiveProps : function(nextProps)
    {
        if (nextProps.initialValue !== this.props.initialValue) {
            this.setState({
                inputValue : nextProps.initialValue
            });
        }
    },

    onChange : function(event)
    {
        var currentValue = event.currentTarget.value;

        this.setState({inputValue : currentValue});

        if (this.props.onChange) {
            this.props.onChange(currentValue, this, event);
        }
    }

};
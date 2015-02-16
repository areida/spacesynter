/* jshint globalstrict: true */
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName : 'NewInstanceBranchSelect',

    onChange : function(e)
    {
        var element  = e.currentTarget,
            selected = element.options[element.selectedIndex],
            value    = selected.value,
            type     = selected.dataset.type;

        this.props.onBranchChange(type, value, selected.dataset);
    },

    getSelectedValue : function()
    {
        var element = this.refs.select.getDOMNode();
        var value   = element.options[element.selectedIndex].value;

        return value;
    },

    render : function()
    {
        var pulls = [];
        pulls.push(this.props.pulls.map(function(pull) {
            var number = pull.number,
                branch = pull.head.ref;
            return <option data-type='pull' data-number={number} value={branch}>{'#'+number+' ('+branch+')'}</option>;
        }));

        var branches = [];
        branches.push(this.props.branches.map(function(branch) {
            return <option data-type='branch' value={branch.name}>{branch.name}</option>;
        }));

        return (
            <select className="input" onChange={this.onChange} ref='select'>
                <option className='placeholder'>{'Select Branch'}</option>
                <optgroup label='Pull Requests'>
                    {pulls}
                </optgroup>
                <optgroup label='Branches'>
                    {branches}
                </optgroup>
            </select>
        );
    }
});

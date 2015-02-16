/* jshint globalstrict: true */
'use strict';

var _     = require('underscore');
var React = require('react');

module.exports = React.createClass({
    displayName : 'NewInstanceProjectSelect',

    propTypes : {
        projects : React.PropTypes.array.isRequired
    },

    onChange : function(e)
    {
        var element = e.currentTarget;
        var value   = element.options[element.selectedIndex].value;

        var project = _.findWhere(this.props.projects, {id : value});

        this.props.onProjectChange(project);
    },

    getSelectedValue : function()
    {
        var element = this.refs.select.getDOMNode();
        var value   = element.options[element.selectedIndex].value;

        return value;
    },

    render : function()
    {
        var projects = this.props.projects.map(function (project) {
            return <option key={project.id} value={project.id}>{project.name}</option>;
        });

        return (
            <select className="input" onChange={this.onChange} ref='select'>
                <option className='placeholder'>{'Select Project'}</option>
                {projects}
            </select>
        );
    }
});

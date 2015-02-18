/* jshint globalstrict: true */
/* global window */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var NewProject = require('../components/project/new');
var Project    = require('../components/project/existing');

module.exports = React.createClass({
    displayName : 'Projects',

    mixins : [FluxMixin, new StoreWatchMixin('ProjectStore')],

    poll : null,

    getInitialState : function()
    {
        return {};
    },

    getStateFromFlux : function()
    {
        return {
            projects : this.getFlux().store('ProjectStore').getAll()
        };
    },

    componentDidMount : function()
    {
        this.updatePoll();
    },

    componentWillUnmount : function()
    {
        if (this.poll) {
            window.clearTimeout(this.poll);
        }
    },

    updatePoll : function()
    {
        this.getFlux().actions.project.fetchAll();
        
        this.poll = _.delay(this.updatePoll, 100000);
    },

    onAddProject : function(project)
    {
        this.getFlux().actions.project.create(project);
    },

    onDelete : function(project)
    {
        this.getFlux().actions.project.remove(project);
    },

    renderProject : function(project)
    {
        return <Project project={project} />;
    },

    render : function()
    {
        return (
            <div>
                <NewProject />
                {this.state.projects.map(this.renderProject)}
            </div>
        );
    }
});

/* jshint globalstrict: true */
/* global window */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var Card            = require('../components/card');
var NewProjectBack  = require('../components/project/new-back');
var NewProjectFront = require('../components/project/new-front');
var ProjectFront    = require('../components/project/existing-front');
var ProjectBack     = require('../components/project/existing-back');

module.exports = React.createClass({
    displayName : 'Projects',

    mixins : [FluxMixin, new StoreWatchMixin('ProjectStore')],

    poll : null,

    componentWillMount : function()
    {
        this.updatePoll();
    },

    componentWillUnmount : function()
    {
        window.clearTimeout(this.poll);
    },

    getInitialState : function()
    {
        return this.getStateFromStores();
    },

    getStateFromStores : function()
    {
        return {
            projects : this.getFlux().store('ProjectStore').fetchAll()
        };
    },

    updatePoll : function()
    {
        this.getFlux().actions.project.fetchAll();
        
        this.poll = window.setTimeout(this.updatePoll, 100000);
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
        return (
            <Card key={project.id}>
                <ProjectFront project={project} />
                <ProjectBack project={project}  />
            </Card>
        );
    },

    render : function()
    {
        return (
            <div className="card__container">
                <Card>
                    <NewProjectFront />
                    <NewProjectBack />
                </Card>
                {this.state.projects.map(this.renderProject)}
            </div>
        );
    }
});

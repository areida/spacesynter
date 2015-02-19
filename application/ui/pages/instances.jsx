/* jshint globalstrict: true */
/* global window */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var NewInstance = require('../components/instance/new');
var Instance    = require('../components/instance/existing');

module.exports = React.createClass({
    displayName : 'Instance',

    mixins : [FluxMixin, new StoreWatchMixin('InstanceStore')],

    poll : null,

    getInitialState : function()
    {
        return {};
    },

    getStateFromFlux : function()
    {
        return {
            instances : this.getFlux().store('InstanceStore').getAll()
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
        this.getFlux().actions.instance.fetchAll();
        
        this.poll = _.delay(this.updatePoll, 100000);
    },

    onAddInstance : function(instance)
    {
        this.getFlux().actions.instance.create(instance);
    },

    onDelete : function(instance)
    {
        this.getFlux().actions.instance.remove(instance);
    },

    renderInstance : function(instance)
    {
        return <Instance instance={instance} />;
    },

    render : function()
    {
        return (
            <div>
                <NewInstance />
                {this.state.instances.map(this.renderInstance)}
            </div>
        );
    }
});

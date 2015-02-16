/* jshint globalstrict: true */
/* global window */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var Card             = require('../card');
var InstanceBack     = require('./existing-back');
var InstanceFront    = require('./existing-front');
var NewInstanceBack  = require('./new-back');
var NewInstanceFront = require('./new-front');

module.exports = React.createClass({

    displayName : 'InstanceList',

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

    componentWillMount : function()
    {
        this.updatePoll();
    },

    componentWillUnmount : function()
    {
        window.clearTimeout(this.poll);
    },

    updatePoll : function()
    {
        this.getFlux().actions.instance.fetchAll();
        
        this.poll = window.setTimeout(this.updatePoll, 5000);
    },

    renderInstance : function(instance)
    {
        return (
            <Card key={instance.id}>
                <InstanceFront instance={instance} />
                <InstanceBack instance={instance} />
            </Card>
        );
    },

    render : function()
    {
        return (
            <div className="card__container">
                <Card>
                    <NewInstanceFront />
                    <NewInstanceBack />
                </Card>
                {this.state.instances.map(this.renderInstance)}
            </div>
        );
    }

});

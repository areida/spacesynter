/* jshint globalstrict: true */
/* global window */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var NewContainer = require('../components/container/new');
var Container    = require('../components/container/existing');

module.exports = React.createClass({
    displayName : 'Container',

    mixins : [FluxMixin, new StoreWatchMixin('ContainerStore')],

    getInitialState : function()
    {
        return {};
    },

    getStateFromFlux : function()
    {
        return {
            containers : this.getFlux().store('ContainerStore').getAll()
        };
    },

    renderContainer : function(container)
    {
        return <Container container={container} />;
    },

    render : function()
    {
        return (
            <div>
                <NewContainer />
                {this.state.containers.map(this.renderContainer)}
            </div>
        );
    }
});

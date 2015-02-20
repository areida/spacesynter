/* jshint globalstrict: true */
/* global window */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var Container    = require('../components/container/existing');
var NewContainer = require('../components/container/new');

var ContainersPage = React.createClass({
    displayName : 'Container',

    mixins : [FluxMixin, new StoreWatchMixin('ContainerStore')],

    statics : {
        fetchData : function(flux)
        {
            return flux.actions.container.fetchAll();
        }
    },

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

    componentDidMount : function()
    {
        if (! this.getFlux().store('ContainerStore').isLoaded()) {
            ContainersPage.fetchData(this.getFlux());
            //this.getFlux().actions.container.fetchAll();
        }
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

module.exports = ContainersPage;

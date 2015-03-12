/* global window */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var Container    = require('./container');
var NewContainer = require('./new-container');

var ContainersPage = React.createClass({
    displayName : 'Container',

    mixins : [FluxMixin, new StoreWatchMixin('ContainerStore')],

    statics : {
        fetchData(flux)
        {
            return flux.actions.container.fetchAll();
        }
    },

    getInitialState()
    {
        return {};
    },

    getStateFromFlux()
    {
        return {
           containers : this.getFlux().store('ContainerStore').getAll()
        };
    },

    componentDidMount()
    {
        if (! this.getFlux().store('ContainerStore').isLoaded()) {
            ContainersPage.fetchData(this.getFlux()).done();
        }
    },

    renderContainer(container, index)
    {
        return <Container container={container} key={index} />;
    },

    render()
    {
        return (
            <div>
                <NewContainer />
                {this.state.containers.map(this.renderContainer).toArray()}
            </div>
        );
    }
});

module.exports = ContainersPage;

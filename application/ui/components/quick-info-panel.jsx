/* jshint globalstrict: true */
'use strict';

var _               = require('underscore');
var React           = require('react');

module.exports = React.createClass({

    displayName : 'QuickInfoPanel',
    mixins      : [],

    getInitialState : function()
    {
        return this.getStateFromStores();
    },

    getStateFromStores : function()
    {
        return {
            rateLimit : this.props.stores.github.rateLimit,
            status    : this.props.stores.system.get()
        };
    },

    render : function()
    {
        var freeMemory,
            loadAverage,
            quickInfoP1,
            quickInfoP2,
            quickInfoP3;

        freeMemory  = '';
        loadAverage = '';

        if (this.state.status) {
            if (this.state.status.load) {
                loadAverage = this.state.status.load.map(function(item) {
                    return Math.round(item * 100) / 100;
                }).join(' / ');
            }

            if (this.state.status.memory) {
                freeMemory = "" + Math.round(this.state.status.memory.free / 1024 / 1024 * 100) / 100;
            }
        }

        quickInfoP1 = 'Load average: ' + loadAverage;
        quickInfoP2 = 'Free memory: ' + freeMemory + ' MB';
        quickInfoP3 = '';

        if (this.state.rateLimit && this.state.rateLimit.remaining) {
            quickInfoP3 = 'Remaining Github API calls: ' +
                this.state.rateLimit.remaining + ' / ' + this.state.rateLimit.limit;
        }

        return (
            <div className="quick-info">
                <p>{quickInfoP1}</p>
                <p>{quickInfoP2}</p>
                <p>{quickInfoP3}</p>
            </div>
        );
    }

});

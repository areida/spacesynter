/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var Link            = require('react-router').Link;
var Navigation      = require('react-router').Navigation;
var State           = require('react-router').State;

var GistsList = require('../components/gists/list');

var GistsPage = React.createClass({

    displayName : 'Gists',

    mixins : [
        FluxMixin, 
        Navigation,
        State,
        new StoreWatchMixin('GithubStore')
    ],

    statics : {
        fetchData : function(flux, params)
        {
            return flux.actions.github.getUsersGists(params.username);
        },
        willTransitionFrom: function (transition, component)
        {
            component.getFlux().actions.github.clearGists();
        }
    },

    getInitialState : function()
    {
        var params, query;

        params = this.getParams();
        query  = this.getQuery();

        return {
            username : params.username || query.username
        };
    },

    getStateFromFlux : function()
    {
        var githubStore = this.getFlux().store('GithubStore');

        return {
            error   : githubStore.getError(),
            gists   : githubStore.getGists(),
            loaded  : githubStore.isLoaded(),
            loading : githubStore.isLoading()
        };
    },

    componentDidMount : function()
    {
        if (! this.state.loaded && ! this.state.error) {
            GistsPage.fetchData(this.getFlux(), {
                username : this.state.username
            }).done();
        }
    },

    render : function() {
        var message, style, title;

        message = null;

        if (this.state.loaded && ! this.state.gists.length) {
            message = 'User has no gists.';
        } else if (this.state.error) {
            message = 'Error loading gists.';
        } else if (this.state.loading) {
            message = 'Loading...';
        }

        style = {
            textAlign : 'center',
            fontSize  : '20px'
        };

        title = (this.state.username ? this.state.username + '\'s' : 'Your') + ' Gists';

        return (
            <div>
                <h1 style={style}>{title}</h1>
                <p>{message}</p>
                <GistsList gists={this.state.gists} />
                <Link to='home'>Go Back</Link>
            </div>
        );
    }
});

module.exports = GistsPage;
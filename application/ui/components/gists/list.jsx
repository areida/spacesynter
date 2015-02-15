/* jshint globalstrict: true */
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName : 'GistsList',

    propTypes : {
        gists : React.PropTypes.array
    },

    getDefaultProps : function()
    {
        return {
            gists : []
        };
    },

    renderGist : function(gist, index)
    {
        return <p key={index}>{gist.description || gist.html_url}</p>;
    },

    render : function()
    {
        return <div>{this.props.gists.map(this.renderGist)}</div>;
    }

});
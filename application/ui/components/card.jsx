/* jshint globalstrict: true */
'use strict';

var React = require('react');
var cx    = require('react/lib/cx');
var _     = require('underscore');

module.exports = React.createClass({
    displayName : 'Card',

    getInitialState : function()
    {
        return {
            flipped : false
        };
    },

    onFlip : function()
    {
        this.setState({ flipped : ! this.state.flipped });
    },

    render : function()
    {
        var classes = cx({
            'flip-container' : true,
            'flipped'        : this.state.flipped
        });

        _.each(this.props.children, function (child) {
            child.props.flip = _.bind(this.onFlip, this);
        }, this);

        return (
            <div className="card__wrapper">
                <div className={classes}>
                    <div className="flipper card">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

});

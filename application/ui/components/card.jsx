/* jshint globalstrict: true */
'use strict';

var React = require('react');
var cx    = React.addons.classSet;
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
        var children, classes;

        children = this.props.children.map(_.bind(function(child) {
            child.props.flip = _.bind(this.onFlip, this);

            return child;
        }, this));

        classes = cx({
            'flip-container' : true,
            'flipped'        : this.state.flipped
        });

        return (
            <div className="card__wrapper">
                <div className={classes}>
                    <div className="flipper card">
                        {children}
                    </div>
                </div>
            </div>
        );
    }

});

/* jshint globalstrict: true */
'use strict';

var React     = require('react');
var FluxMixin = require('fluxxor').FluxMixin(React);

module.exports = React.createClass({
    displayName : 'ExistingInstanceBack',

    mixins : [FluxMixin],

    destroy : function()
    {
        this.getFlux().actions.instance.destroy(instance);
        this.props.flip();
    },

    reprovision : function()
    {
        this.getFlux().actions.instance.reprovision(instance);
        this.props.flip();
    },

    recreate : function(e)
    {
        if (e.currentTarget.classList.contains('button--disabled')) {
            return;
        }

        this.props.flip();
    },

    start : function(e)
    {
        if (e.currentTarget.classList.contains('button--disabled')) {
            return;
        }

        this.props.flip();

    },

    render : function()
    {
        var buttonClasses = React.addons.classSet({
            'button'           : true,
            'button--block'    : true,
            'button--primary'  : true,
            'button--disabled' : false
        });

        var buttonLabel = 'Start';

        return (
            <div className="back">
                <div onClick={this.props.flip} className="card__header">
                    <h2>Actions</h2>
                    <a onClick={this.props.flip} className="card__header--x">×</a>
                </div>
                <div className="small-12 columns">
                    <a onClick={this.start} className={buttonClasses} >{buttonLabel}</a>
                </div>
                <div className="small-12 columns">
                    <a onClick={this.reprovision} className="button button--block">Reprovision</a>
                </div>
                <div className="small-12 columns">
                    <a onDoubleClick={this.recreate} className="button button--block button--disabled">Recreate (not implemented)</a>
                </div>
                <div className="small-12 columns">
                    <a onDoubleClick={this.destroy} className="button button--block button--tertiary">Delete (double-click)</a>
                </div>
            </div>
        );
    }

});

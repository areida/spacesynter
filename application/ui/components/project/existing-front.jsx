/* jshint globalstrict: true */
'use strict';

var React = require('react');
var Link  = require('react-router').Link;
var cx    = React.addons.classSet;

module.exports = React.createClass({
    displayName : 'ExistingProjectFront',

    render : function()
    {
        var project, statusClasses;

        project = this.props.project;

        statusClasses = cx({
            'status-light' : true,
            'warning'      : status === 'deleting',
            'error'        : status === 'error'
        });

        return (
            <div className='instance front'>
                <div className='card__header card__header--center' onClick={this.props.flip}>
                    <h2>{project.name}</h2>
                </div>
                <div className='mimic-form'>
                    <div className='form__input-button small-6 columns border-right'>
                        <Link to='project' params={{id : project.id}} className='log-button'>
                            <h3>Log</h3>
                            <div className='log-icon fa fa-file-code-o' />
                        </Link>
                    </div>
                    <div className='form__input-button small-6 columns'>
                        <a onClick={this.props.flip} className='action-button'>
                            <h3>Status</h3>
                            <div className={statusClasses} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

});

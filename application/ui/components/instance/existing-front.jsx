/* jshint globalstrict: true */
'use strict';

var React = require('react');
var Link  = require('react-router').Link;

module.exports = React.createClass({
    displayName : 'ExistingInstanceFront',

    render : function()
    {
        var instance = this.props.instance,
            status   = instance.deploy_status,
            url      = 'http://' + instance.name + '.spacesynter.com';

        var statusClasses = React.addons.classSet({
            'status-light' : true,
            'pending'      : status === 'cloning' || status === 'provisioning',
            'warning'      : status === 'deleting',
            'error'        : status === 'error',
            'waiting'      : status === 'uninitialized' || status === 'waiting'
        });

        return (
            <div className='instance front'>
                <div className='card__header card__header--center' onClick={this.props.flip}>
                    <h2>{instance.project_name}</h2>
                </div>
                <div className='mimic-form'>
                    <div className='mimic-input-row small-12 columns'>
                        <div className='form__input'>
                            <div className='mimic-input-field'>
                                <div className='mimic-input-inner-wrapper'>
                                    <a href={url} target='_blank'>
                                        <span className='fa fa-external-link input-icon'></span>
                                    </a>
                                    <span className='input-variable'>{instance.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mimic-input-row small-12 columns'>
                        <div className='form__input'>
                            <div className='mimic-input-field'>
                                <div className='mimic-input-inner-wrapper'>
                                    <span className='fa fa-code-fork input-icon'></span>
                                    <span className='input-variable'>{instance.branch}</span>
                                </div>
                            </div>
                            <div className='tooltip__wrapper'>
                                <span className='form__input--tooltip'>Branch: {instance.branch}</span>
                            </div>
                        </div>
                    </div>
                    <div className='mimic-input-row small-12 columns'>
                        <div className='form__input'>
                            <div className='mimic-input-field'>
                                <div className='mimic-input-inner-wrapper'>
                                    <span className='pull-request-icon input-icon'></span>
                                    <span className='input-variable'>@TODO</span>
                                </div>
                            </div>
                            <div className='tooltip__wrapper'>
                                <span className='form__input--tooltip'>Pull Request #@TODO</span>
                            </div>
                        </div>
                    </div>
                    <div className='form__input-button small-6 columns border-right'>
                        <Link to='instance' params={{id : instance.id}} className='log-button'>
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

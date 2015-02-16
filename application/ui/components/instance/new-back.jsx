/* jshint globalstrict: true */
'use strict';

var React           = require('react');
var FluxMixin       = require('fluxxor').FluxMixin(React);
var StoreWatchMixin = require('fluxxor').StoreWatchMixin;
var _               = require('underscore');

var SelectInput = require('../form/inputs/select');
var TextInput   = require('../form/inputs/text');

module.exports = React.createClass({

    displayName : 'NewInstanceBack',
    mixins      : [
        FluxMixin,
        new StoreWatchMixin('GithubStore'),
        new StoreWatchMixin('ProjectStore')
    ],

    getStateFromFlux : function()
    {
        return {
            projects : this.getFlux().store('project').getProjects(),
            branches : this.getFlux().store('github').getBranches(),
            pulls    : this.getFlux().store('github').getPulls()
        };
    },

    getInitialState : function()
    {
        return {
            branch       : null,
            instanceName : null,
            projectId    : null,
            nameDisabled : false
        };
    },

    componentDidMount : function()
    {
        this.getFlux().actions.project.fetchAll();
    },

    onBranchChange : function(branch)
    {
        if (branch === 'pull') {
            this.setState({
                branch       : branch,
                nameDisabled : true,
                instanceName : this.state.project.name + '-' + branch
            });
        } else {
            this.setState({
                branch       : branch,
                nameDisabled : false
            });
        }
    },

    onInstanceNameChange : function(instanceName)
    {
        this.setState({instanceName : instanceName});
    },

    onProjectChange : function(projectId)
    {
        var project, projectName;

        project = _.findWhere(this.state.projects, {id : projectId});

        if (project) {
            this.setState({
                project : project
            });

            projectName = project.repo_name.split('/');

            this.getFlux().actions.github.fetchPulls(projectName[0], projectName[1], 'open');
            this.getFlux().actions.github.fetchBranches(projectName[0], projectName[1]);
        }
    },

    onSubmit : function(event)
    {
        event.preventDefault();

        var instance = {
            project_id    : this.state.project.id,
            name          : this.state.instanceName,
            branch        : this.state.branch,
            deploying     : 0,
            redeploy      : 0,
            deploy_status : 'uninitialized'
        };

        this.getFlux().actions.instance.create(instance);

        this.setState(this.getInitialState());
        this.props.flip();
    },

    validate : function(data)
    {
        return (_.keys(this.state.validation).length === 0);
    },

    render : function()
    {
        var instanceName;

        if (this.state.forcedInstanceName) {
            instanceName = (
                <TextInput
                    className    = 'input input--disabled'
                    disabled     = {true}
                    type         = 'no-edit'
                    initialValue = {this.state.instanceName}
                    id           = 'instanceName' />
            );
        } else {
            instanceName = (
                <TextInput
                    className    = 'input'
                    type         = 'text'
                    id           = 'instanceName'
                    onChange     = {this.onInstanceNameChange}
                    initialValue = {this.state.instanceName} />
            );
        }

        return (
            <div className='back'>
                <div onClick={this.props.flip} className='card__header'>
                    <h2>New Instance</h2>
                    <a onClick={this.props.flip} className='card__header--x'>×</a>
                </div>
                <form className='form new-instance-form' onSubmit={this.onSubmit}>
                    <div className='small-12 columns'>
                        <div>
                            <div className='form__input'>
                                <span className='validate__field-error'>×</span>
                                <span className='validate__field-message'>Please select a repo.</span>
                            </div>
                        </div>
                    </div>
                    <div className='small-12 columns'>
                        <div>
                            <div className='form__input'>
                                <span className='validate__field-error'>×</span>
                                <span className='validate__field-message'>Please select the branch.</span>
                            </div>
                        </div>
                    </div>
                    <div className='small-12 columns'>
                        <div>
                            <div className='form__input'>
                                {instanceName}
                                <span className='validate__field-error'>×</span>
                                <span className='validate__field-message'>Please enter an instance name.</span>
                            </div>
                        </div>
                    </div>
                    <div className='small-5 columns'>
                        <div className='space-remaining'>
                            <span className='space-remaining__interger'>8</span><span className='space-remaining-unit'>GB</span>
                            <p>remaining</p>
                        </div>
                    </div>
                    <div className='small-7 columns'>
                        <button onClick={this.onSubmit} className='button' type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        );
    }

});

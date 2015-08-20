'use strict';

import React  from 'react';
import {List} from 'immutable';
import _      from 'lodash';

import Build  from './build';
import Button from '../buttons/button';
import Upload from '../form/inputs/upload';

class Container extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            killConfirm : false,
            showBuilds  : false
        };
    }

    onActivateBuild(build)
    {
        this.props.flux.actions.build.activate(
            this.props.container.get('name'),
            build.get('_id')
        ).done();
    }

    onDeactivateBuild(build)
    {
        this.props.flux.actions.build.deactivate(
            this.props.container.get('name'),
            build.get('_id')
        ).done();
    }

    onDeleteBuild(build)
    {
        this.props.flux.actions.build['delete'](
            this.props.container.get('name'),
            build.get('_id')
        ).done();
    }

    onDrop(files)
    {
        let file = files[0];

        if (file && file.type === 'application/zip') {
            this.setState({showBuilds : true});

            this.props.flux.actions.build.create(
                this.props.container.get('name'),
                files[0],
                this.onProgress.bind(this)
            ).done();
        }
    }

    onKill()
    {
        this.setState({killConfirm : true});
    }

    onKillConfirm()
    {
        this.props.flux.actions.container.kill(this.props.container.get('name'));
    }

    onNameChange(build, name)
    {
        this.props.flux.actions.build.update(
            this.props.container.get('name'),
            build.get('_id'),
            name
        ).done();
    }

    onProgress(progress)
    {
        this.setState({
            progress : progress
        });
    }

    onToggleBuilds()
    {
        this.setState({
            showBuilds : ! this.state.showBuilds
        });

        if (! this.props.container.get('builds').size) {
            _.delay(() => this.setState({showBuilds : false}), 750);
        }
    }

    renderBuild(build, index)
    {
        let active = (this.props.container.get('build') === build.get('_id'));

        return (
            <Build
                active       = {active}
                created      = {build.get('created')}
                key          = {index}
                name         = {build.get('name')}
                onActivate   = {this.onActivateBuild.bind(this, build)}
                onDeactivate = {this.onDeactivateBuild.bind(this, build)}
                onDelete     = {this.onDeleteBuild.bind(this, build)}
                onNameChange = {this.onNameChange.bind(this, build)}
            />
        );
    }

    renderBuilds()
    {
        if (! this.state.showBuilds) {
            return null;
        }

        let builds = this.props.container.get('builds').sortBy(
            container => container.get('created')
        ).map(this.renderBuild.bind(this));

        return builds.toArray();
    }

    render()
    {
        let host = this.props.container.get('host');

        return (
            <div className='container existing'>
                <div className='row'>
                    <div className='medium-2 columns'>
                        <p><a href={'http://' + host} target='_blank'>{host}</a></p>
                        <p>{this.props.container.get('type')} - {this.props.container.get('status')}</p>
                        <p>{this.props.container.get('backend')}</p>
                    </div>
                    <div className='medium-2 columns' title='Click or Drag Build Here'>
                        <Upload
                            onDrop  = {this.onDrop.bind(this)}
                            percent = {this.props.container.get('progress')}
                        >
                            Add Build
                        </Upload>
                    </div>
                    <div className='medium-2 columns'>
                        <Button
                            color   = {this.state.showBuilds ? 'tertiary' : 'primary'}
                            size    = 'small'
                            onClick = {this.onToggleBuilds.bind(this)}
                        >
                            <a>{this.props.container.get('builds').size ? 'Builds' : 'No builds'}</a>
                        </Button>
                    </div>
                    <div className='medium-6 columns'>
                        <Button
                            color   = 'secondary'
                            size    = 'small'
                            onClick = {this.state.killConfirm ? this.onKillConfirm.bind(this) : this.onKill.bind(this)}
                        >
                            <a>{this.state.killConfirm ? 'Really?' : 'Kill'}</a>
                        </Button>
                    </div>
                </div>
                {this.renderBuilds()}
            </div>
        );
    }
}

Container.displayName = 'Container';

Container.props = {
    containers : React.PropTypes.instanceOf(List)
};

export default Container;

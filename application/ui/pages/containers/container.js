'use strict';

var React = require('react');
var _     = require('lodash');

var Build  = require('../../components/build');
var Button = require('../../components/buttons/button');
var Upload = require('../../components/form/inputs/upload');

class Container extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            percent     : 0,
            showBuilds  : false
        };
    }

    onActivateBuild(build)
    {
        this.props.flux.actions.container.activateBuild(
            this.props.container.get('name'),
            build.get('_id')
        ).done();
    }

    onDeleteBuild(build)
    {
        this.props.flux.actions.container.deleteBuild(
            this.props.container.get('name'),
            build.get('_id')
        ).done();
    }

    onDrop(files)
    {
        this.setState({showBuilds : true});

        this.props.flux.actions.build.create(
            this.props.container,
            files,
            this.onProgress.bind(this)
        ).done();
    }

    onKill()
    {
        this.props.flux.actions.container.kill(this.props.container.get('name'));
    }

    onProgress(percent)
    {
        this.setState({
            percent : percent
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
        var active = (this.props.container.get('build') === build.get('_id'));

        return (
            <Build
                active     = {active}
                created    = {build.get('created')}
                key        = {index}
                name       = {build.get('name')}
                onActivate = {this.onActivateBuild.bind(this, build)}
                onDelete   = {this.onDeleteBuild.bind(this, build)}
            />
        );
    }

    renderBuilds()
    {
        if (! this.state.showBuilds) {
            return null;
        }

        var builds = this.props.container.get('builds').sortBy(
            container => container.get('created')
        ).map(this.renderBuild.bind(this));

        if (! builds.size) {
            builds = builds.push(
                <div className='row build' key={0}>
                    <div className='medium-6 columns'></div>
                    <div className='medium-6 columns'>No builds</div>
                </div>
            );
        }

        return builds.toArray();
    }

    render()
    {
        var host = this.props.container.get('host');

        return (
            <div className='container existing'>
                <div className='row'>
                    <div className='medium-2 columns'>
                        <p><a href={'http://' + host} target='_blank'>{host}</a></p>
                    </div>
                    <div className='medium-2 columns' title='Click or Drag Build Here'>
                        <Upload onDrop={this.onDrop.bind(this)} percent={this.state.percent}>Add Build</Upload>
                    </div>
                    <div className='medium-2 columns'>
                        <Button
                            color   = {this.state.showBuilds ? 'tertiary' : 'primary'}
                            size    = 'small'
                            onClick = {this.onToggleBuilds.bind(this)}
                        >
                            <a>Builds</a>
                        </Button>
                    </div>
                    <div className='medium-6 columns'>
                        <Button
                            color   = 'secondary'
                            size    = 'small'
                            onClick = {this.onKill.bind(this)}
                        >
                            <a>Kill</a>
                        </Button>
                    </div>
                </div>
                {this.renderBuilds()}
            </div>
        );
    }
}

Container.displayName = 'Container';

module.exports = Container;
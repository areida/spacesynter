'use strict';

var React = require('react');

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
    }

    renderBuild(build, index)
    {
        var active = (this.props.container.get('build') === build.get('name'));

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

    render()
    {
        var builds, buildsStyle, host;

        builds      = this.props.container.get('builds').map(this.renderBuild.bind(this));
        buildsStyle = {
            display : this.state.showBuilds ? 'block' : 'none'
        };

        host = this.props.container.get('host');

        if (! builds.size) {
            builds = builds.push(
                <div className='row' key={0}>
                    <div className='medium-2 columns'></div>
                    <div className='medium-10 columns'>No builds</div>
                </div>
            );
        }

        return (
            <div className='container existing'>
                <div className='row'>
                    <div className='medium-2 columns'>
                        <p>{this.props.container.get('name')}</p>
                    </div>
                    <div className='medium-2 columns'>
                        <p><a href={'http://' + host} target='_blank'>{host}</a></p>
                    </div>
                    <div className='medium-2 columns' title='Click or Drag Build Here'>
                        <Upload onDrop={this.onDrop.bind(this)} percent={this.state.percent}>Add Build</Upload>
                    </div>
                    <div className='medium-2 columns'>
                        <Button size='small' onClick={this.onToggleBuilds.bind(this)}>
                            <a>Builds</a>
                        </Button>
                    </div>
                    <div className='medium-4 columns'>
                        <Button size='small' title='Double Click' onDoubleClick={this.onKill.bind(this)}>
                            <a>Kill</a>
                        </Button>
                    </div>
                </div>
                <div className='builds' style={buildsStyle}>
                    {builds.toArray()}
                </div>
            </div>
        );
    }
}

Container.displayName = 'Container';

module.exports = Container;
'use strict';

var React = require('react');

var Button = require('../../components/buttons/button');
var Upload = require('../../components/form/inputs/upload');

class ExistingContainer extends React.Component {
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
        if ((this.props.container.get('activeBuild') === build.get('name'))) {
            return;
        }

        this.props.flux.actions.container.activateBuild(this.props.container.get('name'), build.get('name'));
    }

    onDeleteBuild(build)
    {
        if ((this.props.container.get('activeBuild') === build.get('name'))) {
            return;
        }

        console.log(build.get('name'));
    }

    onDrop(files)
    {
        this.props.flux.actions.build.create(this.props.container, files, this.onProgress);
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
        var active = (this.props.container.get('activeBuild') === build.get('name'));

        return (
            <div className='row' key={index}>
                <div className='medium-2 columns'>&nbsp;</div>
                <div className='medium-2 columns'>{build.get('name')}</div>
                <div className='medium-2 columns'>{build.get('created')}</div>
                <div className='medium-2 columns'>
                    <Button
                        size     = 'tiny'
                        onClick  = {this.onActivateBuild.bind(this, build)}
                        disabled = {active}
                    >
                        <a>Activate</a>
                    </Button>
                </div>
                <div className='medium-2 columns'>
                    <Button
                        size     = 'tiny'
                        onClick  = {this.onDeleteBuild.bind(this, build)}
                        disabled = {active}
                    >
                        <a>Delete</a>
                    </Button>
                </div>
                <div className='medium-2 columns'></div>
            </div>
        );
    }

    render()
    {
        var builds, buildsStyle, host;

        builds      = this.props.container.get('builds').map(this.renderBuild.bind(this)).toArray();
        buildsStyle = {
            display : this.state.showBuilds ? 'block' : 'none'
        };

        host = this.props.container.get('host');

        if (! builds.length) {
            builds = (
                <div className='row'>
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
                        <Button size='small' onClick={this.onToggleBuilds}>
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
                    {builds}
                </div>
            </div>
        );
    }
}

ExistingContainer.displayName = 'ExistingContainer';

module.exports = ExistingContainer;
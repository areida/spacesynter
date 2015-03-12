'use strict';

var React     = require('react');
var FluxMixin = require('fluxxor').FluxMixin(React);

var Button = require('../../components/buttons/button');
var Upload = require('../../components/form/inputs/upload');

var DragAndDropMixin = require('../../mixins/drag-and-drop');

module.exports = React.createClass({
    displayName : 'ExistingContainer',

    mixins : [DragAndDropMixin, FluxMixin],

    getInitialState()
    {
        return {
            percent    : 0,
            showBuilds : false
        };
    },

    onKill()
    {
        this.getFlux().actions.container.kill(this.props.container.get('name'));
    },

    onToggleBuilds()
    {
        this.setState({showBuilds : ! this.state.showBuilds});
    },

    renderBuild : function(build, index)
    {
        return (
            <div className='row' key={index}>
                <div className='medium-6 columns'></div>
                <div className='medium-6 columns'>{build.get('name')}</div>
            </div>
        );
    },

    render()
    {
        var buildsStyle, host;

        buildsStyle = {
            display : this.state.showBuilds ? 'block' : 'none'
        };

        host = this.props.container.get('host');

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
                        <Upload onDrop={this.onDrop} percent={this.state.uploadPercent}>Add Build</Upload>
                    </div>
                    <div className='medium-2 columns'>
                        <Button size='small'>
                            <a onClick={this.onToggleBuilds}>Builds</a>
                        </Button>
                    </div>
                    <div className='medium-4 columns'>
                        <Button size='small'>
                            <a onDoubleClick={this.onKill} title='Double Click'>Kill</a>
                        </Button>
                    </div>
                </div>
                <div className='builds' style={buildsStyle}>
                    {this.props.container.get('builds').map(this.renderBuild).toArray()}
                </div>
            </div>
        );
    }

});

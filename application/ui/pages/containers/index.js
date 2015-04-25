'use strict';

var React = require('react');
var _     = require('underscore');

var Container    = require('./container');
var NewContainer = require('./new-container');

class ContainersPage extends React.Component {
    static fetchData(flux)
    {
        return flux.actions.container.fetchAll();
    }

    constructor(props)
    {
        super(props);

        this.state = this.getStateFromProps(props);

        this.onChange = this.onChange.bind(this);
    }

    getStateFromProps(props)
    {
        return {
            containers : props.flux.store('ContainerStore').getAll()
        };
    }

    onChange()
    {
        this.setState(this.getStateFromProps(this.props));
    }

    componentWillMount()
    {
        this.props.flux.store('ContainerStore').on('change', this.onChange);
    }

    componentDidMount()
    {
        if (! this.props.flux.store('ContainerStore').isLoaded()) {
            ContainersPage.fetchData(this.props.flux).done();
        }
    }

    componentWillUnmount()
    {
        this.props.flux.store('ContainerStore').removeListener('change', this.onChange);
    }

    renderContainer(container, index)
    {
        return <Container container={container} key={index} />;
    }

    render()
    {
        return (
            <div>
                <NewContainer {...this.props} />
                {this.state.containers.map(this.renderContainer).toArray()}
            </div>
        );
    }
}

ContainersPage.displayName = 'ContainersPage';

module.exports = ContainersPage;

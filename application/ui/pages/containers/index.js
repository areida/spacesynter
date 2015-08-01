'use strict';

var React = require('react');

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

    render()
    {
        var containers = this.state.containers.sortBy(
            container => container.get('created')
        ).map(
            (container, index) => <Container {...this.props} container={container} key={index} />
        );
        
        return (
            <div>
                <NewContainer {...this.props} />
                {containers.toArray()}
            </div>
        );
    }
}

ContainersPage.displayName = 'ContainersPage';

module.exports = ContainersPage;

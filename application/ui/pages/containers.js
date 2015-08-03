'use strict';

import React from 'react';
import _     from 'lodash';

import Container    from '../components/container/container';
import NewContainer from '../components/container/new-container';

const POLL_DELAY = 1000;

class ContainersPage extends React.Component {
    static fetchData(flux)
    {
        return flux.actions.container.fetchAll();
    }

    constructor(props)
    {
        super(props);

        this.state    = this.getStateFromProps(props);
        this.onChange = this.onChange.bind(this);
    }

    getStateFromProps(props)
    {
        return {
            containers : props.flux.store('Container').getAll()
        };
    }

    onChange()
    {
        this.setState(this.getStateFromProps(this.props));
    }

    componentWillMount()
    {
        this.props.flux.store('Container').on('change', this.onChange);
        this.poll();
    }

    componentDidMount()
    {
        if (! this.props.flux.store('Container').isLoaded()) {
            ContainersPage.fetchData(this.props.flux).done();
        }
    }

    componentWillUnmount()
    {
        this.props.flux.store('Container').removeListener('change', this.onChange);
    }

    poll()
    {
        ContainersPage.fetchData(this.props.flux).done(
            _.delay(this.poll.bind(this), POLL_DELAY)
        );
    }

    render()
    {
        let containers = this.state.containers.sortBy(
            container => container.get('created')
        ).map(
            (container, index) => (
                <Container
                    {...this.props}
                    container = {container}
                    key       = {index}
                />
            )
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

export default ContainersPage;

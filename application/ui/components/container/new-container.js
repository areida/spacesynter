'use strict';

import React from 'react';

import Button from '../buttons/button';
import Select from '../form/inputs/select';
import Text   from '../form/inputs/text';

const DEFAULT_PATHS = {
    nodejs   : 'server/index.js',
    php      : '',
    'static' : 'build'
};

const TYPE_OPTIONS = [
    {
        text  : 'NodeJS',
        value : 'nodejs'
    },
    {
        text  : 'PHP',
        value : 'php'
    },
    {
        text  : 'Static',
        value : 'static'
    }
];

class NewContainer extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            backend : '',
            name    : '',
            path    : DEFAULT_PATHS.nodejs,
            type    : 'nodejs'
        };

        this.onCreated = this.onCreated.bind(this);
    }

    componentDidMount()
    {
        this.props.flux.store('Container').on('created', this.onCreated);
    }

    componentWillUnmount()
    {
        this.props.flux.store('Container').removeListener('created', this.onCreated);
    }

    onCreated()
    {
        this.setState({
            backend : '',
            name    : '',
            path    : DEFAULT_PATHS.nodejs,
            type    : 'nodejs'
        });
    }

    onFormChange(value, element)
    {
        let state = this.state;

        state[element.props.id] = value;

        if (element.props.id === 'type') {
            state.path = DEFAULT_PATHS[value];
        }

        this.setState(state);
    }

    onSubmit(event)
    {
        event.preventDefault();

        this.props.flux.actions.container.create(
            this.state.name.trim(),
            this.state.path,
            this.state.type,
            this.state.backend
        ).done();
    }

    render()
    {
        return (
            <div className='container new'>
                <form
                    className = 'form new-container-form'
                    onSubmit  = {this.onSubmit.bind(this)}
                >
                    <div className='row'>
                        <div className='medium-3 columns'>
                            <Text
                                id          = 'name'
                                value       = {this.state.name}
                                onChange    = {this.onFormChange.bind(this)}
                                placeholder = 'Name'
                                size        = 'small'
                                type        = 'text'
                            />
                        </div>
                        <div className='medium-3 columns'>
                            <Text
                                id          = 'backend'
                                value       = {this.state.backend}
                                onChange    = {this.onFormChange.bind(this)}
                                placeholder = 'Backend'
                                size        = 'small'
                                type        = 'text'
                            />
                        </div>
                        <div className='medium-2 columns'>
                            <Select
                                id       = 'type'
                                value    = {this.state.type}
                                onChange = {this.onFormChange.bind(this)}
                                options  = {TYPE_OPTIONS}
                                size     = 'small'
                            />
                        </div>
                        <div className='medium-2 columns'>
                            <Text
                                id          = 'path'
                                value       = {this.state.path}
                                onChange    = {this.onFormChange.bind(this)}
                                placeholder = 'Path'
                                size        = 'small'
                                type        = 'text'
                            />
                        </div>
                        <div className='medium-2 columns'>
                            <Button
                                block     = {true}
                                className = 'button'
                                type      = 'submit'
                                size      = 'small'
                                onClick   = {this.onSubmit.bind(this)}
                            >
                                <a>Create</a>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

NewContainer.displayName = 'NewContainer';

export default NewContainer;

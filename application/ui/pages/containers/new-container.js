'use strict';

var React = require('react');

var Button = require('../../components/buttons/button');
var Select = require('../../components/form/inputs/select');
var Text   = require('../../components/form/inputs/text');

var defaultPaths = {
    nodejs   : 'server/index.js',
    'static' : 'build'
};

var typeOptions = [{
    text  : 'NodeJS',
    value : 'nodejs'
}, {
    text  : 'Static',
    value : 'static'
}];

class NewContainer extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            name : '',
            path : defaultPaths.nodejs,
            type : 'nodejs'
        };

        this.onCreated = this.onCreated.bind(this);
    }

    componentDidMount()
    {
        this.props.flux.store('ContainerStore').on('created', this.onCreated);
    }

    componentWillUnmount()
    {
        this.props.flux.store('ContainerStore').removeListener('created', this.onCreated);
    }

    onCreated()
    {
        this.setState({
            name : '',
            path : defaultPaths.nodejs,
            type : 'nodejs'
        });
    }

    onFormChange(value, element)
    {
        var state = this.state;

        state[element.props.id] = value;

        if (element.props.id === 'type') {
            state.path = defaultPaths[value];
        }

        this.setState(state);
    }

    onSubmit(event)
    {
        event.preventDefault();

        this.props.flux.actions.container.create(
            this.state.name.trim(),
            this.state.path,
            this.state.type
        ).done();
    }

    render()
    {
        return (
            <div className='container new row'>
                <form
                    className = 'form new-container-form'
                    onSubmit  = {this.onSubmit.bind(this)}
                >
                    <div className='medium-2 columns'>
                        <Text
                            id          = 'name'
                            value       = {this.state.name}
                            onChange    = {this.onFormChange.bind(this)}
                            placeholder = 'Name'
                            size        = 'small'
                            type        = 'text'
                        />
                    </div>
                    <div className='medium-2 columns'>
                        <Select
                            id       = 'type'
                            value    = {this.state.type}
                            onChange = {this.onFormChange.bind(this)}
                            options  = {typeOptions}
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
                    <div className='medium-6 columns'>
                        <Button
                            className = 'button'
                            type      = 'submit'
                            size      = 'small'
                            onClick   = {this.onSubmit.bind(this)}
                        >
                            <a>Create</a>
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

NewContainer.displayName = 'NewContainer';

module.exports = NewContainer;

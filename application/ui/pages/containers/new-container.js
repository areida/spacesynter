'use strict';

var React = require('react');
var _     = require('lodash');

var Button = require('../../components/buttons/button');
var Select = require('../../components/form/inputs/select');
var Text   = require('../../components/form/inputs/text');

class NewContainer extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {name  : ''};

        this.onCreated = this.onCreated.bind(this);
    }

    componentDidMount()
    {
        this.props.flux.store('ContainerStore').on('created', this.onCreated);
    }

    componentWillUnmount()
    {
        this.props.flux.store('ContainerStore').removeListener('created'. this.onCreated);
    }

    onCreated()
    {
        this.setState({name  : ''});
    }

    onFormChange(value, element)
    {
        var state = this.state;

        state[element.props.id] = value;

        this.setState(state);
    }

    onSubmit(event)
    {
        event.preventDefault();

        if (this.state.name && this.state.name.length) {
            this.props.flux.actions.container.create(this.state.name).done();
        }
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
                            id           = 'name'
                            value        = {this.state.name}
                            onChange     = {this.onFormChange.bind(this)}
                            placeholder  = 'Name'
                            size         = 'small'
                            type         = 'text'
                        />
                    </div>
                    <div className='medium-10 columns'>
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

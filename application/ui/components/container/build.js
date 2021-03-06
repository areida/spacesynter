'use strict';

import React  from 'react';
import moment from 'moment';

import Button from '../buttons/button';

class Build extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            deleteConfirm : false,
            editing       : false,
            name          : null
        };
    }

    onDelete()
    {
        this.setState({
            deleteConfirm : true
        });
    }

    onNameChange(event)
    {
        this.setState({
            name : event.target.value
        });
    }

    onToggleEdit()
    {
        this.setState({
            editing : ! this.state.editing
        });

        if (this.state.name && this.state.name !== this.props.name) {
            this.props.onNameChange(this.state.name);

            this.setState({
                name : null
            });
        }
    }

    renderDelete()
    {
        if (this.props.active) {
            return null;
        }

        return (
            <Button
                block   = {true}
                size    = 'tiny'
                onClick = {this.state.deleteConfirm ? this.props.onDelete : this.onDelete.bind(this)}
                color   = 'secondary'
            >
                <a>{this.state.deleteConfirm ? 'Really?' : 'Delete'}</a>
            </Button>
        );
    }

    renderName()
    {
        if (this.state.editing) {
            return (
                <input
                    type     = 'text'
                    value    = {this.state.name || this.props.name}
                    onBlur   = {this.onToggleEdit.bind(this)}
                    onChange = {this.onNameChange.bind(this)}
                />
            );
        } else {
            return (
                <div onDoubleClick = {this.onToggleEdit.bind(this)}>
                    {this.props.name}
                </div>
            );
        }
    }

    render()
    {
        let created = moment(this.props.created).local().calendar(null, {
            lastWeek : 'dddd [at] LT',
            sameElse : 'L [at] LT'
        });

        return (
            <div className='row build'>
                <div className='medium-2 columns'>
                    &nbsp;
                </div>
                <div className='medium-3 columns'>
                    {this.renderName()}
                </div>
                <div className='medium-3 columns'>
                    <div className='medium-6 columns'>
                        <Button
                            block   = {true}
                            size    = 'tiny'
                            onClick = {this.props.active ? this.props.onDeactivate : this.props.onActivate}
                            color   = {this.props.active ? 'secondary' : 'primary'}
                        >
                            <a>{this.props.active ? 'Deactivate' : 'Activate'}</a>
                        </Button>
                    </div>
                    <div className='medium-6 columns'>
                        {this.renderDelete()}
                    </div>
                </div>
                <div className='medium-3 columns'>
                    {created}
                </div>
            </div>
        );
    }
}

Build.displayName = 'Build';
Build.propTypes   = {
    active       : React.PropTypes.bool.isRequired,
    created      : React.PropTypes.string.isRequired,
    name         : React.PropTypes.string.isRequired,
    onActivate   : React.PropTypes.func.isRequired,
    onDelete     : React.PropTypes.func.isRequired,
    onDeactivate : React.PropTypes.func.isRequired,
    onNameChange : React.PropTypes.func.isRequired
};

export default Build;

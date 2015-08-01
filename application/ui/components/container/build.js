'use strict';

import React  from 'react';
import moment from 'moment';

import Button from '../buttons/button';

class Build extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            deleteConfirm : false
        };
    }

    onDelete()
    {
        this.setState({
            deleteConfirm : true
        });
    }

    renderDelete()
    {
        if (this.props.active) {
            return null;
        }

        return (
            <Button
                size     = 'tiny'
                onClick  = {this.state.deleteConfirm ? this.props.onDelete : this.onDelete.bind(this)}
                color    = 'secondary'
            >
                <a>{this.state.deleteConfirm ? 'Really?' : 'Delete'}</a>
            </Button>
        );
    }

    render()
    {
        let created = moment.utc(this.props.created);

        if (created > moment.utc().subtract(1, 'day')) {
            created = created.fromNow();
        } else {
            created = created.format('MMM Do, YYYY');
        }

        return (
            <div className='row build'>
                <div className='medium-2 columns'>{this.props.name}</div>
                <div className='medium-2 columns'>{created}</div>
                <div className='medium-2 columns'>
                    <Button
                        size    = 'tiny'
                        onClick = {this.props.onActivate}
                        color   = {this.props.active ? 'secondary' : 'primary'}
                    >
                        <a>{this.props.active ? 'Deactivate' : 'Activate'}</a>
                    </Button>
                </div>
                <div className='medium-2 columns'>
                    {this.renderDelete()}
                </div>
                <div className='medium-4 columns'></div>
            </div>
        );
    }
}

Build.displayName = 'Build';
Build.propTypes   = {
    active     : React.PropTypes.bool.isRequired,
    created    : React.PropTypes.string.isRequired,
    name       : React.PropTypes.string.isRequired,
    onActivate : React.PropTypes.func.isRequired,
    onDelete   : React.PropTypes.func.isRequired
};

export default Build;
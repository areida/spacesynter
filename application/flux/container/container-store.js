'use strict';

import Immutable from 'immutable';

import ApiStore  from '../api-store';
import constants from '../../constants';

export default class ContainerStore extends ApiStore {
    constructor()
    {
        super();
        this.state = new Immutable.fromJS({
            containers : []
        });

        this.bindActions(
            constants.ACTIVATE_BUILD_SUCCESS, 'onUpdateSuccess',
            constants.CREATE_BUILD_PROGRESS, 'onCreateBuildProgress',
            constants.CREATE_BUILD_SUCCESS, 'onUpdateSuccess',
            constants.DELETE_BUILD_SUCCESS, 'onUpdateSuccess',
            constants.CONTAINER_FETCH_ALL, 'onFetchAll',
            constants.CONTAINER_FETCH_ALL_SUCCESS, 'onFetchAllSuccess',
            constants.CONTAINER_CREATE_SUCCESS, 'onCreateSuccess',
            constants.CONTAINER_KILL_SUCCESS, 'onKillSuccess'
        );
    }

    findIndexByName(name)
    {
        return this.state.get('containers').findIndex(c => c.get('name') === name);
    }

    getAll()
    {
        return this.state.get('containers');
    }

    onCreateBuildProgress(payload)
    {
        let container, index;

        index      = this.findIndexByName(payload.container);
        container  = this.state.get('containers').get(index).set('progress', payload.progress);
        this.state = this.state.set('containers', this.state.get('containers').set(index, container));

        this.emit('change');
    }

    onCreateSuccess(container)
    {
        let containers = this.state.get('containers').push(Immutable.fromJS(container));

        this.state = this.state.set('containers', containers);

        this.emit('change');
        this.emit('created');
    }

    onUpdateSuccess(container)
    {
        let containers, index;

        index      = this.findIndexByName(container.name);
        containers = this.state.get('containers').set(index, Immutable.fromJS(container));
        this.state = this.state.set('containers', containers);

        this.emit('change');
    }

    onFetchAll()
    {
        this.state = this.state.merge({
            loaded  : false,
            loading : true
        });

        this.emit('change');
    }

    onFetchAllSuccess(containers)
    {
        this.state = new Immutable.fromJS({
            containers : containers,
            loaded     : true,
            loading    : false
        });

        this.emit('change');
    }

    onKillSuccess(name)
    {
        let containers = this.state.get('containers').filterNot(c => c.get('name') === name);

        this.state = this.state.set('containers', containers);

        this.emit('change');
    }
}

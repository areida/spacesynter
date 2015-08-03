'use strict';

import Immutable from 'immutable';

import ApiStore  from '../api-store';
import constants from '../../constants';

export default class ContainerStore extends ApiStore {
    constructor()
    {
        super();
        this.containers = new Immutable.List();

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
        return this.containers.findIndex(c => c.get('name') === name);
    }

    getAll()
    {
        return this.containers;
    }

    onCreateBuildProgress(payload)
    {
        let index       = this.findIndexByName(payload.container);
        this.containers = this.containers.set(
            index,
            this.containers.get(index).set('progress', payload.progress)
        );

        this.emit('change');
    }

    onCreateSuccess(container)
    {
        this.containers = this.containers.push(Immutable.fromJS(container));

        this.emit('change');
        this.emit('created');
    }

    onUpdateSuccess(container)
    {
        let index       = this.findIndexByName(container.name);
        this.containers = this.containers.set(index, Immutable.fromJS(container));

        this.emit('change');
    }

    onFetchAll()
    {
        this.loading = true;

        this.emit('change');
    }

    onFetchAllSuccess(containers)
    {
        this.containers = new Immutable.fromJS(containers);
        this.loaded     = true;
        this.loading    = false;

        this.emit('change');
    }

    onKillSuccess(name)
    {
        this.containers = this.containers.filterNot(c => c.get('name') === name);

        this.emit('change');
    }
}

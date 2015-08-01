'use strict';

import Immutable from 'immutable';

import ApiStore  from '../api-store';
import constants from '../../constants';

export default class ContainerStore extends ApiStore {
    constructor()
    {
        super();
        this.state = {
            containers : new Immutable.List()
        };

        this.bindActions(
            constants.ACTIVATE_BUILD_SUCCESS, 'onActvateBuildSuccess',
            constants.CREATE_BUILD_SUCCESS, 'onCreateBuildSuccess',
            constants.DELETE_BUILD_SUCCESS, 'onDeleteBuildSuccess',
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

    onActvateBuildSuccess(container)
    {
        let containers, index;

        index      = this.findIndexByName(container.name);
        containers = this.state.get('containers').set(index, Immutable.fromJS(container));

        this.state = this.state.set('containers', containers);

        this.emit('change');
    }

    onCreateBuildSuccess(container)
    {
        let containers, index;

        index      = this.findIndexByName(container.name);
        containers = this.state.get('containers').set(index, Immutable.fromJS(container));

        this.state = this.state.set('containers', containers);

        this.emit('change');
    }

    onDeleteBuildSuccess(payload)
    {
        let container, containers, index;

        index      = this.findIndexByName(payload.name);
        container  = this.state.get('containers').get(index);
        container  = container.set('builds', container.get('builds').filterNot(build => build.get('_id') === payload.build));
        containers = this.state.get('containers').set(index, Immutable.fromJS(container));

        this.state = this.state.set('containers', containers);

        this.emit('change');
    }

    onCreateSuccess(container)
    {
        let containers = this.state.get('containers').push(Immutable.fromJS(container));

        this.state = this.state.set('containers', containers);

        this.emit('change');
        this.emit('created');
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

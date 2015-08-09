'use strict';

import Fluxxor from 'fluxxor';

import Stores  from './flux/stores';
import actions from './flux/actions';

export default () => {
    return new Fluxxor.Flux(Stores, actions);
};
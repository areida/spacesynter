'use strict';

import Fluxxor from 'fluxxor';

import Stores  from './stores';
import actions from './actions';

export default () => {
    return new Fluxxor.Flux(Stores, actions);
};
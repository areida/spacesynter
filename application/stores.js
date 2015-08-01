'use strict';

import ContainerStore from './store/container';
import TokenStore     from './store/token';

export default {
    ContainerStore : new ContainerStore(),
    TokenStore     : new TokenStore()
};

'use strict';

import ContainerStore from './flux/container/container-store';
import TokenStore     from './flux/auth/token-store';

export default {
    ContainerStore : new ContainerStore(),
    TokenStore     : new TokenStore()
};

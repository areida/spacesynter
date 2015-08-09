'use strict';

import ContainerStore from './container/container-store';
import TokenStore     from './auth/token-store';

export default {
    Container : new ContainerStore(),
    Token     : new TokenStore()
};

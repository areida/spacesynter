'use strict';

import ContainerStore from './flux/container/container-store';
import TokenStore     from './flux/auth/token-store';

export default {
    Container : new ContainerStore(),
    Token     : new TokenStore()
};

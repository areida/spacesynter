'use strict';

import Relay from './relay';

relay = new Relay();

export default {
    container : {
        getAll()
        {
            return relay.query()
        }
    }
};

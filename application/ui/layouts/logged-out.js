'use strict';

import React          from 'react';
import {RouteHandler} from 'react-router';

class LoggedOutLayout extends React.Component {
    render()
    {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler {...this.props} />
            </div>
        );
    }
}

LoggedOutLayout.displayName = 'LoggedOutLayout';

export default LoggedOutLayout;
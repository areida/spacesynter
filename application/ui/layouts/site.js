'use strict';

import React          from 'react';
import {RouteHandler} from 'react-router';

class SiteLayout extends React.Component {
    render()
    {
        return (
            <div className='l--app-wrapper'>
                <RouteHandler {...this.props} />
            </div>
        );
    }
}

SiteLayout.displayName = SiteLayout;

export default SiteLayout;
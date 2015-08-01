/* jshint unused: false */
'use strict';

import React   from 'react';
import {Route} from 'react-router';

import LoggedInLayout  from './ui/layouts/logged-in';
import LoggedOutLayout from './ui/layouts/logged-out';
import SiteLayout      from './ui/layouts/site';

import ContainersPage  from './ui/pages/containers';
import LoginPage       from './ui/pages/login';
import NotFoundPage    from './ui/pages/404';

export default (
    <Route handler={SiteLayout}>
        <Route handler={LoggedInLayout}>
            <Route path='/' name='containers' handler={ContainersPage} />
        </Route>
        <Route handler={LoggedOutLayout}>
            <Route path='/login' name='login' handler={LoginPage} />
            <Route path='*' name='404' handler={NotFoundPage} />
        </Route>
    </Route>
);
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';

import UserLogin from './components/user/login';
import UserRegister from './components/user/register';
import UserProfile from './components/user/profile';
import PostTimeline from './components/post/timeline';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={UserLogin} />
    <Route path="/profile" component={UserProfile} />
    <Route path="/register" component={UserRegister} />
    <Route path="/timeline" component={PostTimeline} />
  </Route>
);


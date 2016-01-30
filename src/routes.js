import React from 'react';
import {Route} from 'react-router';
import App from './App';

export default (
  <Route>
    <Route path="/" component={App} />
    <Route path="/about" component={() => (<h1>about</h1>)} />
  </Route>
);

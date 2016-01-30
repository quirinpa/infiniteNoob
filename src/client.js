import routes from './routes';
// import reducers from './reducers';

import React from 'react';
// import { routerStateReducer, reduxReactRouter, Router } from 'redux-router';
// import { combineReducers, createStore, Provider } from 'redux';
import { Router, browserHistory } from 'react-router';
// import { createHistory } from 'history';
import { render } from 'react-dom';

render(
  // <Provider store={createStore(
  //   combineReducers({
  //     router: routerStateReducer,
  //     ...reducers,
  //   }),
  //   // initialState,
  //   reduxReactRouter({routes, createHistory})
  // )} key="provider">
  <Router history={browserHistory}>{routes}</Router>,
  // </Provider>,
  document.getElementById('content')
);

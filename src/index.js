import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';

import 'bootstrap';
import './theme/sass/app.scss';

import { App } from 'modules/core/containers';
import { configureStore, makeAppRoutes } from './common';
import { setApiActions } from 'services';

const initialState = {};
const { store, actions, history } =
  configureStore({ initialState, historyType: hashHistory });

setApiActions(actions);
let render = (routerKey = null) => {
  const routes = makeAppRoutes(store);

  const mountNode = document.querySelector('#root');
  ReactDOM.render(
    <App history={history}
      store={store}
      actions={actions}
      routes={routes}
      routerKey={routerKey} />, mountNode);
};

render();

import { hashHistory } from 'react-router';
import { bindActionCreatorsToStore } from 'redux-module-builder';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import createDebounce from 'redux-debounce';

import { createStore, compose, applyMiddleware } from 'redux';
import { rootReducer, actions, initialState } from './root-reducer';
import * as Helpers from '../utils/helpers';
const logger = createLogger({
  level: 'info',
  collapsed: true
});

export const configureStore = ({
  historyType = hashHistory,
  userInitialState = {} }) => {
  let middleware = [
    thunkMiddleware,
    routerMiddleware(historyType)
  ];

  if (DEV) {
    middleware.push(logger);
  }

  // No need for this in the blog article
  middleware.push(createDebounce({
    simple: 2000
  }));

  let tools = [];

  // Redux development tool extension
  // Refer https://github.com/zalmoxisus/redux-devtools-extension
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    DEV &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;
  /* eslint-enable */

  let finalCreateStore;
  finalCreateStore = composeEnhancers(
    applyMiddleware(...middleware),
    ...tools
  )(createStore);

  const store = finalCreateStore(
    rootReducer,
    Object.assign({}, initialState, userInitialState)
  );


  store.subscribe(() => {
    let storeState;
    let localState = Helpers.loadState();
    for (let key in localState) {
      if (!key.includes('core') || key === 'core_language') {
        storeState = {
          ...storeState,
          [key]: store.getState()[key]
        };
      }
    }
    Helpers.saveState(Object.assign({}, initialState, storeState));
  });

  const history = syncHistoryWithStore(historyType, store, {
    adjustUrlOnReplay: true
  });

  const boundActions = bindActionCreatorsToStore(actions, store);
  return { store, actions: boundActions, history };
};

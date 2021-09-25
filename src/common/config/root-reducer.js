import { combineReducers } from 'redux';
import { routerReducer as routing, push } from 'react-router-redux';
import { reducer as reduxFormReducer } from 'redux-form';
import _ from 'lodash';

import { redux as moduleRedux } from 'modules';
import * as Helpers from '../utils/helpers';
let modules = {};

Object.keys(moduleRedux).forEach(key => {
  const redux = moduleRedux[key];
  if (redux) {
    modules[key] = redux;
  }
});

export let actions = {
  routing: {
    navigateTo: path => dispatch => dispatch(push(path))
  }
};

export let initialState = {};
export let reducers = {
  routing,
  form: reduxFormReducer
};

Object.keys(modules).forEach(key => {
  const container = modules[key];
  initialState[key] = container.initialState || {};
  actions[key] = container.actions;
  reducers[key] = container.reducer;
});

let cloneInitialState = _.cloneDeep(initialState);
let localState = Helpers.loadState();
if (!localState || _.isNull(localState) || localState === 'null') {
  Helpers.saveState(initialState);
} else {
  initialState = localState;
}

const appReducer = combineReducers(reducers);

export const rootReducer = (state, action) => {
  if (action.type === 'USERS_LOGOUT' || action.type === 'USERS_CANCEL_FORCE_RESET') {
    state = cloneInitialState;
  }

  return appReducer(state, action);
};

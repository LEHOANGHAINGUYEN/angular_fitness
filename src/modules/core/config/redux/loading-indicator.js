import { createConstants, createReducer } from 'redux-module-builder';

export const types = createConstants('loading')('SHOW_LOADING', 'HIDE_LOADING', 'DECREASE_COUNT_LOADING');

export const actions = {
  show: () => (dispatch) => {
    dispatch({ type: types.SHOW_LOADING });
  },
  hide: () => (dispatch, getState) => {
    if (getState().core_loading.count <= 1) {
      dispatch({ type: types.HIDE_LOADING });
    } else {
      dispatch({ type: types.DECREASE_COUNT_LOADING });
    }
  }
};

export const reducer = createReducer({
  [types.SHOW_LOADING]: (state) => {
    return {
      ...state,
      count: state.count + 1,
      isLoading: true
    };
  },
  [types.DECREASE_COUNT_LOADING]: (state) => {
    return {
      ...state,
      count: state.count - 1,
      isLoading: true
    };
  },
  [types.HIDE_LOADING]: (state) => {
    return {
      ...state,
      count: 0,
      isLoading: false
    };
  }
});

export const initialState = {
  // Workaround for case multiple loading is called at once
  count: 0,
  isLoading: false
};

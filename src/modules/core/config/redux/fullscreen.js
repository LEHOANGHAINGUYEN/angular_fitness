import { createConstants, createReducer } from 'redux-module-builder';

import { Helpers } from 'common';

export const types = createConstants('fullscreen')('EXPAND', 'COLLAPSE', 'FIRST_SCREENLOAD', 'CLEAR_FIRST_SCREENLOAD');

export const actions = {
  /**
   * Expand fullscreen
   */
  expand: () => (dispatch) => {
    Helpers.expandFullscreen();
    dispatch({ type: types.EXPAND });
  },
  /**
   * Collapse fullscreen
   */
  collapse: () => (dispatch) => {
    Helpers.exitFullscreen();
    dispatch({ type: types.COLLAPSE });
  },
  /**
   * Trigger first fullscreen load for app
   * It is using for document.click function
   */
  firstScreenLoad: () => (dispatch) => {
    dispatch({ type: types.FIRST_SCREENLOAD });
  },
  /**
   * Clear first screen load state
   */
  clearFirstScreenLoad: () => (dispatch) => {
    dispatch({ type: types.CLEAR_FIRST_SCREENLOAD });
  }
};

export const reducer = createReducer({
  [types.EXPAND]: (state) => {
    return {
      ...state,
      isExpand: true
    };
  },
  [types.COLLAPSE]: (state) => {
    return {
      ...state,
      isExpand: false
    };
  },
  [types.FIRST_SCREENLOAD]: (state) => {
    return {
      ...state,
      firstScreenLoad: true
    };
  },
  [types.CLEAR_FIRST_SCREENLOAD]: (state) => {
    return {
      ...state,
      firstScreenLoad: false
    };
  }
});

export const initialState = {
  firstScreenLoad: false,
  isExpand: false
};

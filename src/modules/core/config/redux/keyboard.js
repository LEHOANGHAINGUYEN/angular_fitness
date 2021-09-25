import { createConstants, createReducer } from 'redux-module-builder';

export const types = createConstants('keyboard')(
  'SHOW',
  'HIDE',
  'SET_CHANGE',
  'ON_SUBMIT',
  'ON_ENTER');

/**
 * Actions for keyboard
 */
export const actions = {
  /**
   * Show keyboard function
   */
  show: (e) => (dispatch) => {
    dispatch({ type: types.SHOW, payload: e });
  },

  /**
   * Hide keyboard funtion
   */
  hide: (e, force) => (dispatch) => {
    force = force || false;
    if (!force && (e.target.className.includes('alKeyboard')
      || (e.target.parentElement && e.target.parentElement.className.includes('alKeyboard'))
      || (e.target.parentElement && e.target.parentElement.id === 'alKeyboard'))) { return false; }
    dispatch({ type: types.HIDE, payload: e });
    return undefined;
  },
  /**
     * Update onEnter callback function
     */
  setChangeFunction: (func) => (dispatch) => {
    dispatch({ type: types.SET_CHANGE, payload: func });
  },
  /**
   * Update keyboard target
   */
  onSubmit: () => (dispatch) => {
    dispatch({ type: types.ON_SUBMIT });
  },

  /**
 * Update onEnter callback function
 */
  setOnEnterCallback: (func) => (dispatch) => {
    dispatch({ type: types.ON_ENTER, payload: func });
  }
};

/**
 * Reducer for above actions
 */
export const reducer = createReducer({
  [types.SHOW]: (state, { payload }) => {
    return {
      ...state,
      isShow: true,
      target: payload
    };
  },
  [types.HIDE]: (state, { payload }) => {
    return {
      ...state,
      isShow: false,
      change: undefined,
      target: payload
    };
  },
  [types.ON_SUBMIT]: (state) => {
    return {
      ...state,
      onEnterCallback: undefined
    };
  },
  [types.SET_CHANGE]: (state, { payload }) => {
    return {
      ...state,
      change: payload
    };
  },
  [types.ON_ENTER]: (state, { payload }) => {
    return {
      ...state,
      onEnterCallback: payload
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  change: undefined,
  isShow: false,
  target: undefined,
  onEnterCallback: undefined
};

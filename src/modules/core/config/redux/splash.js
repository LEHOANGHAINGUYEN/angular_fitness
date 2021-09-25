import { createConstants, createReducer } from 'redux-module-builder';

export const types = createConstants('splash')('SHOW_SPLASH', 'HIDING_SPLASH', 'HIDE_SPLASH');

export const actions = {
  show: () => (dispatch) => {
    dispatch({ type: types.SHOW_SPLASH });
  },
  hide: (time) => (dispatch) => {
    dispatch({ type: types.HIDING_SPLASH });
    setTimeout(() => {
      dispatch({ type: types.HIDE_SPLASH });
    }, time);
  }
};

export const reducer = createReducer({
  [types.SHOW_SPLASH]: (state) => {
    return {
      ...state,
      isShow: true
    };
  },
  [types.HIDE_SPLASH]: (state) => {
    return {
      ...state,
      isShow: false,
      hiding: false
    };
  },
  [types.HIDING_SPLASH]: (state) => {
    return {
      ...state,
      hiding: true
    };
  }
});

export const initialState = {
  isShow: false,
  hiding: false
};

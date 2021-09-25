import { createConstants, createReducer } from 'redux-module-builder';

import { StudioService } from 'services';

export const types = createConstants('challenges')(
  'REQUEST_FAILED',
  'FETCHED_SUGGESTION_OPTION',
  'ERROR_FETCH_DATA'
);

export const actions = {
  fetchsOptionSuggestion: (value) => (dispatch) => {
    if (!value) {
      dispatch({
        type: types.FETCHED_SUGGESTION_OPTION,
        payload: []
      });
    }
    else {
      return StudioService.searchStudio(value).then(res => {
        if (res) {
          dispatch({ type: types.FETCHED_SUGGESTION_OPTION, payload: res.data });
        }
      }, err => {
        dispatch({
          type: types.ERROR_FETCH_DATA,
          payload: err
        });
      });
    }
    return undefined;
  }
};
export const reducer = createReducer({
  [types.REQUEST_FAILED]: (state, { payload }) => {
    return {
      ...state,
      errors: payload
    };
  },
  [types.FETCHED_SUGGESTION_OPTION]: (state, { payload }) => {
    return {
      ...state,
      studiosOption: payload,
      errors: undefined
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  loading: false,
  errors: undefined,
  studiosOption: []
};

import { createConstants, createReducer } from 'redux-module-builder';

import { MemberService } from 'services';
import { errorHandlerConstants } from 'modules/core/config/redux/error-handler';


export const types = createConstants('members')(
  'FETCHING_SUGGESTION',
  'FETCHED_SUGGESTION',
  'UPDATING_INPUT',
  'CLEAR_SUGGESTION');

export const actions = {
  fetchMembersSuggestion: () => (dispatch) => {
    dispatch({ type: types.FETCHING_SUGGESTION });
  },
  searchMembersSuggestion: (keyword, studioId) => (dispatch) => {
    if (!keyword || keyword.length < 3) {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: { error: new Error('At least 3 characters to search.') }
      });
    } else {
      dispatch({ type: types.FETCHING_SUGGESTION });
      MemberService.searchMember(keyword, studioId)
        .then((res) => {
          dispatch({ type: types.FETCHED_SUGGESTION, payload: res.data.clients});
        })
        .catch(() => {
          dispatch({ type: types.FETCHED_SUGGESTION, payload: [] });
        });
    }
  },
  updateCurrentMember: (newValue) => (dispatch) => {
    dispatch({ type: types.UPDATING_INPUT, payload: newValue });
  },
  clearMemberSuggestion: () => (dispatch) => {
    dispatch({ type: types.CLEAR_SUGGESTION });
  }
};

export const reducer = createReducer({
  [types.FETCHING_SUGGESTION]: (state) => {
    return {
      ...state,
      fetching: true,
      suggestions: [],
      errors: undefined
    };
  },
  [types.FETCHED_SUGGESTION]: (state, { payload }) => {
    return {
      ...state,
      fetching: false,
      members: payload,
      suggestions: payload,
      errors: undefined
    };
  },
  [types.UPDATING_INPUT]: (state, { payload }) => {
    return {
      ...state,
      member: payload || ''
    };
  },
  [types.CLEAR_SUGGESTION]: (state) => {
    return {
      ...state,
      fetching: false,
      suggestions: [],
      members: [],
      member: ''
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  errors: undefined,
  fetching: false,
  member: '',
  members: [],
  suggestions: []
};

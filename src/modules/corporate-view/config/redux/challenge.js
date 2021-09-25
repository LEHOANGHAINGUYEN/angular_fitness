import { createConstants, createReducer } from 'redux-module-builder';

import { ChallengeLeaderService } from 'services';
import { errorHandlerConstants } from 'modules/core/config/redux/error-handler';
import { alertConstants } from 'modules/core/config/redux/alert';

export const types = createConstants('corp_challenges')(
  'SEND_EMAIL', 'REQUEST_FAILED'
);

/**
 * Actions for corporate challenge
 */
export const actions = {
  sendEmail: (date, studioId) => (dispatch) => {
    ChallengeLeaderService.sendEmail(date, studioId).then(res => {
      if (res) {
        dispatch({
          type: types.SEND_EMAIL,
          payload: res
        });
        dispatch({ type: alertConstants.SHOW_INFOR, payload: 'Send summary email successfully.' });
      }
    }, err => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: { error: err }
      });
    });
  }
};

/**
 * Reducer for above actions
 */
export const reducer = createReducer({
  [types.SEND_EMAIL]: (state) => {
    return {
      ...state
    };
  },
  [types.REQUEST_FAILED]: (state, { payload }) => {
    return {
      ...state,
      errors: payload
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  errors: undefined
};

import { createConstants, createReducer } from 'redux-module-builder';
import moment from 'moment';

import { AgendaService } from 'services';
import { errorHandlerConstants } from 'modules/core/config/redux/error-handler';
import { messages } from 'localization';

export const types = createConstants('roster')('SELECTED_CLASS', 'CLEAR_SELECTED_CLASS', 'ERROR_GET_DATA',
  'FETCHING_MEMBERS', 'GET_MEMBERS_OF_CLASS');

export const actions = {
  selectClass: (mboClassId, mboStudioId) => (dispatch) => {
    return AgendaService.getAllMember(mboClassId, mboStudioId)
      .then((result) => {
        dispatch({
          type: types.SELECTED_CLASS,
          payload: result.data
        });
      }).catch((err) => {
        if (err.response.data.message.includes('ClassID') && err.response.data.message.includes('does not exist.')) {
          const message = messages[moment.locale()]['ClassTime.Error.IsCanceled'];
          dispatch({
            type: errorHandlerConstants.HANDLE_ERROR,
            payload: { error: new Error(message) }
          });
        } else {
          dispatch({
            type: errorHandlerConstants.HANDLE_ERROR,
            payload: { error: err }
          });
        }
      });
  },
  clearSelectedClass: () => (dispatch) => {
    dispatch({
      type: types.CLEAR_SELECTED_CLASS
    });
  },
  refreshMember: (mboClassId, mboStudioId) => (dispatch) => {
    AgendaService.refreshMember(mboClassId, mboStudioId).then(res => {
      if (res) {
        dispatch({
          type: types.GET_MEMBERS_OF_CLASS,
          payload: res.data.roster
        });
      }
    }, err => {
      dispatch({
        type: types.ERROR_GET_DATA,
        payload: err
      });
    });
  }
};


export const reducer = createReducer({
  [types.SELECTED_CLASS]: (state, {
    payload
  }) => {
    return {
      ...state,
      selectedClass: payload.classSchedule,
      members: payload.roster
    };
  },
  [types.CLEAR_SELECTED_CLASS]: (state) => {
    return {
      ...state,
      selectedClass: undefined,
      members: []
    };
  },
  [types.GET_MEMBERS_OF_CLASS]: (state, {
    payload
  }) => {
    return {
      ...state,
      members: payload,
      errors: undefined
    };
  },
  [types.ERROR_GET_DATA]: (state, {
    payload
  }) => {
    return {
      ...state,
      members: [],
      errors: payload
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  selectedClass: undefined,
  members: []
};

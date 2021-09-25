import { createConstants, createReducer } from 'redux-module-builder';

import { AgendaService } from 'services';
import { Constants } from 'common';

export const types = createConstants('agenda')('GET_ALL_SCHEDULE', 'ERROR_GET_DATA',
  'SELECT_DATE', 'ACTIVE_ROSTER', 'CLEAR_CLASS_TIME');

export const actions = {
  getClassesByMboStudio: (mboStudioId, date, studioId) => (dispatch) => {
    AgendaService.getClassesByMboStudio(mboStudioId, date, studioId).then(res => {
      if (res) {
        dispatch({
          type: types.GET_ALL_SCHEDULE,
          payload: res.data.classes
        });
      }
    }, err => {
      dispatch({
        type: types.ERROR_GET_DATA,
        payload: err
      });
    });
  },
  getClassesByStudio: (studioId, date) => (dispatch) => {
    AgendaService.getClassesByStudio(studioId, date).then(res => {
      if (res) {
        dispatch({
          type: types.GET_ALL_SCHEDULE,
          payload: res.data
        });
      }
    }, err => {
      dispatch({
        type: types.ERROR_GET_DATA,
        payload: err
      });
    });
  },
  selectDate: (date) => (dispatch) => {
    localStorage.setItem(Constants.SelectedDateKey, JSON.stringify(date));
    dispatch({
      type: types.SELECT_DATE,
      payload: date
    });
  },
  updateActiveRoster: (bool) => (dispatch) => {
    dispatch({
      type: types.ACTIVE_ROSTER,
      payload: bool
    });
  },
  clearClassTime: () => (dispatch) => {
    dispatch({ type: types.CLEAR_CLASS_TIME });
  }
};


export const reducer = createReducer({
  [types.GET_ALL_SCHEDULE]: (state, {
    payload
  }) => {
    return {
      ...state,
      schedules: payload,
      updated: false,
      errors: undefined
    };
  },
  [types.ERROR_GET_DATA]: (state, {
    payload
  }) => {
    return {
      ...state,
      schedules: [],
      errors: payload
    };
  },
  [types.SELECT_DATE]: (state, {
    payload
  }) => {
    return {
      ...state,
      selectedDate: payload
    };
  },
  [types.ACTIVE_ROSTER]: (state, {
    payload
  }) => {
    return {
      ...state,
      isRosterActive: payload
    };
  },
  [types.CLEAR_CLASS_TIME]: (state) => {
    return {
      ...state,
      schedules: []
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  loading: false,
  errors: undefined,
  schedules: [],
  selectedDate: undefined,
  isRosterActive: false
};

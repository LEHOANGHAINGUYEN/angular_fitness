import { createConstants, createReducer } from 'redux-module-builder';

import { errorHandlerConstants } from 'modules/core/config/redux/error-handler';
import { ChallengeService } from 'services';

export const types = createConstants('metrics')('FETCHED_METRICS');

export const actions = {
  fetchMetricsByEquipment: (equipmentId) => (dispatch) => {
    ChallengeService.getMetricsByEquipment(equipmentId)
      .then(res => {
        let payload = res.data;
        dispatch({ type: types.FETCHED_METRICS, payload });
      })
      .catch(error => {
        dispatch({
          type: errorHandlerConstants.HANDLE_ERROR,
          payload: { error }
        });
      });
  }
};

export const reducer = createReducer({
  [types.FETCHED_METRICS]: (state, { payload }) => {
    return {
      ...state,
      metrics: payload,
      errors: undefined
    };
  }
});

/*
 * The initial state for this part of the component tree
 */
export const initialState = {
  errors: undefined,
  metrics: []
};

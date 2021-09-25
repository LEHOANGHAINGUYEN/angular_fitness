import { createConstants, createReducer } from 'redux-module-builder';

import { AlertType } from '../../components';

/**
 * Define alert action constants
 */
export const alertConstants = createConstants('alert')(
  'SHOW_INFOR',
  'SHOW_ERROR',
  'DESTROY_ALERT'
);

export const actions = {
  /**
   * Show infor alert for end user
   * @param {string} inforMessage The infor message that to show for end user
   */
  showInfor: (inforMessage) => (dispatch) => {
    dispatch({ type: alertConstants.SHOW_INFOR, payload: inforMessage });
  },

  /**
   * Show error alert for end user
   * @param {string} errorMessage The error message that to show for end user
   */
  showError: (errorMessage) => (dispatch) => {
    dispatch({ type: alertConstants.SHOW_ERROR, payload: errorMessage });
  },

  /**
   * Destroy alert
   */
  destroyAlert: () => (dispatch) => {
    dispatch({ type: alertConstants.DESTROY_ALERT });
  }
};

export const reducer = createReducer({
  [alertConstants.SHOW_INFOR]: (state, { payload }) => {
    return {
      ...state,
      alertType: AlertType.Info,
      message: payload
    };
  },
  [alertConstants.SHOW_ERROR]: (state, { payload }) => {
    return {
      ...state,
      alertType: AlertType.Error,
      message: payload
    };
  },
  [alertConstants.DESTROY_ALERT]: (state) => {
    return {
      ...state,
      alertType: undefined,
      message: undefined
    };
  }
});

export const initialState = {
  alertType: undefined,
  message: undefined
};

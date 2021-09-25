import { createConstants, createReducer } from 'redux-module-builder';

import { alertConstants } from './alert';

/**
 * Define errors action constants
 */
export const errorHandlerConstants = createConstants('errors')(
  'HANDLE_ERROR',
  'DESTROY_ERROR'
);

export const actions = {
  /**
   * Handle error exception
   * @param {any} error The error object
   */
  handleError: (error) => (dispatch, getState) => {
    let standardizedError;
    let errorMessage;

    // Standardize error
    if (error instanceof Error) {
      standardizedError = error;
    } else if (error.data && error.status) {
      // If error is returned from server
      if (typeof error.data === 'string') {
        standardizedError = new Error(error.data);
      } else if (typeof error.data === 'object' && error.data.Message) {
        standardizedError = new Error(error.data.Message);
      }
    } else if (typeof error === 'string') {
      standardizedError = new Error(error);
    }

    if (!standardizedError) {
      standardizedError = new Error('Something wrong happened!');
    }

    // Try get error message from response
    if (standardizedError.response && standardizedError.response.data) {
      if (standardizedError.response.data.Errors) {
        errorMessage = standardizedError.response.data.Errors[0] || standardizedError.response.data.Message;
      } else {
        errorMessage = standardizedError.response.data;
      }
    } else {
      errorMessage = error.message;
    }

    // If this value is false, shouldn't show alert/notification
    if (!getState().core_errorHandler.isSilence) {
      // We can using modal or toast for notify/alert to end user
      dispatch({ type: alertConstants.SHOW_ERROR, payload: errorMessage });
    }
    // Log error / send stack trace error to remote server
    // Or using Sentry (Raven.js), OverOps for error tracking
  },

  /**
   * Destroy error
   */
  destroyError: () => (dispatch) => {
    dispatch({ type: errorHandlerConstants.DESTROY_ERROR });
  }
};

export const reducer = createReducer({
  [errorHandlerConstants.HANDLE_ERROR]: (state, { payload }) => {
    let isSilence = payload.isSilence === undefined || payload.isSilence === null ?
      false :
      payload.isSilence;

    return {
      ...state,
      error: payload.error,
      isSilence
    };
  },
  [errorHandlerConstants.DESTROY_ERROR]: (state) => {
    return {
      ...state,
      error: undefined,
      isSilence: false
    };
  }
});

export const initialState = {
  error: undefined,
  isSilence: false
};

import { createConstants, createReducer } from 'redux-module-builder';

import { CognitoService, LoginService } from 'services';
import { AppConstants, Constants } from 'common';
import { errorHandlerConstants } from 'modules/core/config/redux/error-handler';
import {LocaleSessionConstant } from 'common/constants/constants';
import { actions as rootActions } from 'common/config/root-reducer';
import { types as loadingConstants } from 'modules/core/config/redux/loading-indicator';

export const types = createConstants('users')('CANCEL_FORCE_RESET', 'ERROR_FETCH_DATA', 'FORCE_CHANGE_PASSWORD_SUCCESS', 'FETCHING_SUGGESTION', 'FETCHED_SUGGESTION', 'UPDATING_INPUT', 'CLEAR_SUGGESTION', 'LOGIN', 'LOGGED_IN_USER', 'LOGGED_IN_STUDIO', 'ERROR_LOGGING_IN', 'LOGOUT',
  'SELECTING_STUDIO', 'SELECTED_STUDIO', 'ERROR_SELECT_STUDIO', 'CLEAR_CURRENT_STUDIO', 'CLEAR_ERRORS', 'REQUESTING_RESET', 'RESET_SUCCESS', 'CLEAR_COGNITO_USER', 'FORCE_CHANGE_PASSWORD');

export function loading() {
  return { type: loadingConstants.SHOW_LOADING };
}

export function handleError(err) {
  return {
    type: errorHandlerConstants.HANDLE_ERROR,
    payload: { error: err }
  };
}

export const actions = {
  fetchUsersSuggestion: (value) => (dispatch) => {
    dispatch({ type: types.FETCHING_SUGGESTION });
    if (!value || (value && !value.trim())) {
      dispatch({
        type: types.FETCHED_SUGGESTION,
        payload: []
      });
    } else {
      return LoginService.getStudioSuggestions(value, { isUndergroundReq: true })
        .then(res => {
          if (res) {
            dispatch({ type: types.FETCHED_SUGGESTION, payload: res.data });
          }
        }, err => {
          if (!err.response) {
            dispatch({
              type: types.FETCHED_SUGGESTION,
              payload: []
            });
          } else {
            dispatch({
              type: types.ERROR_FETCH_DATA,
              payload: err
            });
          }
        });
    }
    return undefined;
  },
  /**
   * Update selected studio
   */
  updateCurrentStudio: (studio) => (dispatch) => {
    dispatch({ type: types.SELECTED_STUDIO, payload: studio });
  },
  updateCurrentUser: (newValue) => (dispatch) => {
    dispatch({ type: types.UPDATING_INPUT, payload: newValue });
  },
  clearUserSuggestion: () => (dispatch) => {
    dispatch({ type: types.CLEAR_SUGGESTION });
  },
  clearCurrentStudio: () => (dispatch) => {
    dispatch({ type: types.CLEAR_CURRENT_STUDIO });
  },
  loginStudio: (studio, password) => (dispatch, getState) => {
    dispatch({ type: types.LOGIN });
    const loginObject = {
      StudioId: studio ? studio.StudioId : 0,
      Password: password
    };

    const email = (studio || {}).StudioAccount || '';

    return CognitoService.login(email, password).then(result => {
      // Login success
      if (result && result.status === Constants.CognitoStatus.Success) {
        localStorage.setItem('cognitoAuthKey', result.data.getIdToken().getJwtToken());
        return LoginService.login(loginObject, 'Studio').then(res => {
          if (res) {
            dispatch({
              type: types.LOGGED_IN_STUDIO,
              payload: studio
            });
            localStorage.setItem('fca_auth', JSON.stringify(getState().auth_users));
          }
        }, err => {
          dispatch(handleError(err));
        });
      }
      else if (result && result.status === Constants.CognitoStatus.NewPasswordRequired) {
        // We need force change password at the first time login
        dispatch({ type: types.FORCE_CHANGE_PASSWORD, payload: studio.StudioAccount });
      }

      return null;
    }, err => dispatch(handleError(err)));
  },
  loginUser: (username, password) => (dispatch, getState) => {
    dispatch({ type: types.LOGIN });
    let user = {
      Email: username,
      Password: password
    };
    return CognitoService.login(username, password).then(result => {
      // Login success
      if (result && result.status === Constants.CognitoStatus.Success) {
        localStorage.setItem('cognitoAuthKey', result.data.getIdToken().getJwtToken());
        return LoginService.login(user).then(res => {
          if (res) {
            dispatch({
              type: types.LOGGED_IN_USER,
              payload: res.data
            });
            localStorage.setItem('fca_auth', JSON.stringify(getState().auth_users));
          }
        }, err => {
          dispatch(handleError(err));
        });
      }
      else if (result && result.status === Constants.CognitoStatus.NewPasswordRequired) {
        // We need force change password at the first time login
        dispatch({ type: types.FORCE_CHANGE_PASSWORD, payload: username });
      }

      return null;
    }, err => dispatch(handleError(err)));
  },
  completeNewPassword: (username, password, newPassword) => (dispatch) => {
    dispatch(loading());

    return CognitoService.completeNewPassword(username, password, newPassword).then(result => {
      // Force change password success
      if (result && result.status === Constants.CognitoStatus.SetNewPasswordSuccess) {
        // Just logout and redirect to login page
        dispatch({ type: types.FORCE_CHANGE_PASSWORD_SUCCESS });
      }
    }, err => dispatch(handleError(err)));
  },
  logout: () => (dispatch) => {
    const locale = localStorage.getItem(LocaleSessionConstant);
    const leaderboardOpt = localStorage.getItem(Constants.LeaderboardOptionalKey);
    localStorage.clear();
    dispatch({ type: types.LOGOUT });
    rootActions.core_language.changeLocale(locale);
    rootActions.core_screen.clearFirstScreenLoad();
    localStorage.setItem(Constants.LeaderboardOptionalKey, leaderboardOpt);
  },
  clearErrors: () => (dispatch) => {
    dispatch({ type: types.CLEAR_ERRORS });
  },
  clearCognitoUser: () => (dispatch) => {
    dispatch({ type: types.CLEAR_COGNITO_USER });
  },
  sendMailResetPassword: (email) => (dispatch) => {
    dispatch({ type: types.REQUESTING_RESET });
    dispatch({ type: loadingConstants.SHOW_LOADING });
    return CognitoService.resetPassword(email).then(cognitoUser => {
      dispatch({ type: loadingConstants.HIDE_LOADING });
      if (cognitoUser) {
        dispatch({
          type: types.RESET_SUCCESS,
          payload: { cognitoUser, email }
        });
      }
    }, err => {
      dispatch({
        type: errorHandlerConstants.HANDLE_ERROR,
        payload: {
          error: err
        }
      });
    });
  },
  resetNewPassword: (verificationCode, newPassword) => (dispatch, getState) => {
    const email = getState().auth_users.email;
    dispatch({ type: types.REQUESTING_RESET });
    dispatch({ type: loadingConstants.SHOW_LOADING });
    return CognitoService.confirmPassword(email, verificationCode, newPassword)
      .then(() => {
        dispatch({ type: loadingConstants.HIDE_LOADING });
        dispatch({
          type: types.RESET_SUCCESS,
          payload: {}
        });
      })
      .catch(err => {
        dispatch({
          type: errorHandlerConstants.HANDLE_ERROR,
          payload: {
            error: err
          }
        });
      });
  },
  cancelForceChangePassword: () => (dispatch) => {
    let locale = localStorage.getItem(LocaleSessionConstant);
    localStorage.clear();
    dispatch({ type: types.CANCEL_FORCE_RESET });
    rootActions.core_language.changeLocale(locale);
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
      studios: payload,
      suggestions: payload,
      errors: undefined,
      fetching: false
    };
  },
  [types.UPDATING_INPUT]: (state, { payload }) => {
    return {
      ...state,
      studio: payload
    };
  },
  [types.CLEAR_SUGGESTION]: (state) => {
    return {
      ...state,
      suggestions: []
    };
  },
  [types.FORCE_CHANGE_PASSWORD]: (state, {payload}) => {
    return {
      ...state,
      loading: false,
      errors: undefined,
      newPasswordRequired: true,
      email: payload
    };
  },
  [types.FORCE_CHANGE_PASSWORD_SUCCESS]: (state) => {
    return {
      ...state,
      loading: false,
      errors: undefined,
      forceChangePasswordSuccess: true,
      newPasswordRequired: false
    };
  },
  [types.LOGIN]: (state) => {
    return {
      ...state,
      loading: true,
      errors: undefined
    };
  },
  [types.LOGGED_IN_USER]: (state, { payload }) => {
    return {
      ...state,
      loading: false,
      currentUser: payload,
      loginType: 'user'
    };
  },
  [types.LOGGED_IN_STUDIO]: (state, { payload }) => {
    return {
      ...state,
      loading: false,
      currentStudio: payload,
      loginType: 'studio'
    };
  },
  [types.ERROR_LOGGING_IN]: (state, { payload }) => {
    return {
      ...state,
      errors: payload
    };
  },
  [types.LOGOUT]: (state) => {
    return {
      ...state,
      currentStudio: undefined,
      currentUser: undefined,
      studio: '',
      studios: [],
      suggestions: []
    };
  },
  [types.SELECTED_STUDIO]: (state, { payload }) => {
    return {
      ...state,
      selectedStudio: payload
    };
  },
  [types.CLEAR_CURRENT_STUDIO]: (state) => {
    return {
      ...state,
      selectedStudio: undefined
    };
  },
  [types.CLEAR_ERRORS]: (state) => {
    return {
      ...state,
      errors: undefined
    };
  },
  [types.RESET_SUCCESS]: (state, { payload: { cognitoUser, email } }) => {
    return {
      ...state,
      cognitoUser,
      email
    };
  },
  [types.CLEAR_COGNITO_USER]: (state) => {
    return {
      ...state,
      cognitoUser: undefined
    };
  }
});

const loginSession = JSON.parse(localStorage.getItem('fca_auth'));

/*
 * The initial state for this part of the component tree
 */
export const initialState = loginSession ? loginSession : {
  loading: false,
  errors: undefined,
  currentStudio: undefined,
  newPasswordRequired: false,
  forceChangePasswordSuccess: false,
  studio: '',
  studios: [],
  suggestions: [],
  fetching: false,
  loginType: 'studio',
  currentUser: undefined,
  notifications: [...AppConstants.notifications],
  cognitoUser: undefined,
  email: undefined,
  selectedStudio: undefined
};

import React from 'react';
import { Route } from 'react-router';

import Login from '../containers/login/Login';
import { CognitoService } from 'services';
import { rootActions, Helpers } from 'common';

export const makeRoutes = (getState) => {
  const requireNoAuth = (nextState, replace, callback) => {
    const { auth_users } = getState();
    const { currentStudio, currentUser, loginType } = auth_users;

    if (!currentStudio && !currentUser) {
      Helpers.clearStorageByPrefix('CognitoIdentityServiceProvider.');

      return callback();
    }

    if ((currentStudio || currentUser) && CognitoService.getCurrentUser()) {
      if (loginType === 'studio') {
        replace({
          pathname: '/studio',
          state: {}
        });
      } else {
        replace({
          pathname: '/corporate/coaches-hub',
          state: {}
        });
      }

      return callback();
    }

    return CognitoService.refreshToken()
      .then((result) => {
        let currentToken = localStorage.getItem('cognitoAuthKey');

        if (result !== currentToken) {
          localStorage.setItem('cognitoAuthKey', result);
        }

        // Re-authorize the route after refresh token
        replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        });

        return callback();
      })
      .catch(() => {
        callback();
        rootActions.auth_users.clearCurrentStudio();
      });
  };
  /**
   * Return route define
   */
  return (
    <Route key='app'>
      <Route path='login' onEnter={requireNoAuth} component={Login} />
      <Route path='admin/login' onEnter={requireNoAuth} component={Login} />
    </Route>
  );
};

import React from 'react';
import { Route, Redirect } from 'react-router';

import { AppConstants } from 'common';
import { NotFound, Unauthorized } from 'modules/core/containers';
import {
  Container,
  CoachesHub,
  PushNotifications,
  LeaderBoard,
  InteractiveLeaderBoard,
  PersonalRecordBreakers,
  Challenges,
  MemberManagement,
  StudioManagement,
  Profiles,
  GeneralSettings, Permissions,
  Reports,
  ChallengeTemplate
} from '../containers';
import { CognitoService } from 'services';

export const makeRoutes = (getState) => {
  const requireAuth = (nextState, replace, callback) => {
    const { auth_users } = getState();
    const { currentUser } = auth_users;

    if (!currentUser) {
      replace({
        pathname: '/admin/login',
        state: { nextPathname: nextState.location.pathname }
      });

      return callback();
    } else if (!CognitoService.getCurrentUser()) {
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
      });
    }
    return callback();
  };

  /**
   * Return route define
   */
  return (
    <Route key='corporate-view'>
      {AppConstants.defaultPagePath.corporate !== '/corporate' ? <Redirect from='/corporate' to={AppConstants.defaultPagePath.corporate} /> : ''}
      <Route path='/corporate' component={Container}>
        <Route path='studio-management' onEnter={requireAuth} component={StudioManagement} />
        <Route path='coaches-hub' onEnter={requireAuth} component={CoachesHub} />
        <Route path='push-notifications' onEnter={requireAuth} component={PushNotifications} />
        <Route path='template' onEnter={requireAuth} component={ChallengeTemplate} />
        <Route path='challenges' onEnter={requireAuth} component={Challenges} />
        <Route path='leader-board' onEnter={requireAuth} component={LeaderBoard} />
        <Route path='interactive-leader-board' onEnter={requireAuth} component={InteractiveLeaderBoard} />
        <Route path='personal-record-breaker' onEnter={requireAuth} component={PersonalRecordBreakers} />
        <Route path='reports' onEnter={requireAuth} component={Reports} />
        <Route path='member-management' onEnter={requireAuth} component={MemberManagement} />
        <Route path='permission' onEnter={requireAuth} component={Permissions} />
        <Route path='settings' onEnter={requireAuth} component={GeneralSettings} />
        <Route path='unauthorized' component={Unauthorized} status={401} />
        <Route path='profiles' onEnter={requireAuth} component={Profiles} />
        { /* Catch all route */}
        <Route path='*' component={NotFound} status={404} />
      </Route>
    </Route>
  );
};

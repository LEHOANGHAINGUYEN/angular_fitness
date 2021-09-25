import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import { AppConstants } from 'common';
import { NotFound, Unauthorized } from 'modules/core/containers';
import { MemberDetail } from 'modules/shared/containers';
import {
  Container,
  CoachsHubPage,
  InputScreen,
  LeaderBoard,
  ClassRoster,
  TodayChallengeLeader,
  Overall,
  TodayPersonalRecords,
  MemberSearch,
  StudioManagement,
  LanguageSetting,
  GlobalLeaderBoard
} from '../containers';
import { CognitoService } from 'services';

export const makeRoutes = (getState) => {
  const requireAuth = (nextState, replace, callback) => {
    const { auth_users } = getState();
    const { currentStudio } = auth_users;
    if (!currentStudio) {
      replace({
        pathname: '/login',
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
  return (
    <Route key='studio-view'>
      {AppConstants.defaultPagePath.studio !== '/studio' ? <Redirect from='/studio' to={AppConstants.defaultPagePath.studio} /> : ''}
      <Route path='/studio' component={Container}>
        <Route path='studio-management' onEnter={requireAuth} component={StudioManagement} />
        <Route onEnter={requireAuth} key='coach-hub-home' name='Home'
          path='coach-hub-home' component={CoachsHubPage} />
        <Route key='input-screen' name='Input Results'
          path='input-screen'>
          <IndexRoute onEnter={requireAuth} component={InputScreen} />
          <Route onEnter={requireAuth} key='class-roster'
            name='Class Roster'
            path='class-roster'
            component={ClassRoster} />
        </Route>
        <Route onEnter={requireAuth} key='member-search' path='member-search'
          component={MemberSearch} />
        <Route onEnter={requireAuth} key='member-details' path='member-details/:id'
          component={MemberDetail} />
        <Route key='leader-board' name='Leader Board'
          path='leader-board'>
          <IndexRoute onEnter={requireAuth} component={LeaderBoard} />
          <Route onEnter={requireAuth}
            key='today-challenge-leader'
            name="Today's Leader Board"
            path='today-challenge-leader'
            component={TodayChallengeLeader} />
          <Route onEnter={requireAuth}
            key='overall-leader-board'
            name='Overall Leader Board'
            path='interactive-leader-board'
            component={Overall} />
          <Route onEnter={requireAuth}
            key='today-personal-records'
            name='Personal Record Breaker'
            path='today-personal-records'
            component={TodayPersonalRecords} />
          <Route onEnter={requireAuth}
            key='global' name='global'
            path='global-leaderboard'
            component={GlobalLeaderBoard}/>
        </Route>
        <Route onEnter={requireAuth} key='language-setting' path='settings/languages'
          component={LanguageSetting} />
        <Route path='unauthorized' component={Unauthorized} status={401} />
        { /* Catch all route */}
        <Route path='*' component={NotFound} status={404} />
      </Route>
    </Route>
  );
};

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';

import { makeRoutes } from 'modules';
import { AppConstants } from 'common';
import { NotFound } from 'modules/core/containers';

const makeAppRoutes = (state) => {
  let { getState } = state;
  let moduleRoutes = [];
  Object.keys(makeRoutes).forEach(key => {
    let mRoutes = makeRoutes[key](getState);
    moduleRoutes.push(mRoutes);
  });

  return (
    <Route path=''>
      {AppConstants.defaultPagePath.app !== '/' ? <Redirect from='/' to={AppConstants.defaultPagePath.app} /> : ''}
      {moduleRoutes}
      <Route path='*' component={NotFound} status={404} />
    </Route>
  );
};

makeAppRoutes.PropTypes = {
  state: PropTypes.object
};

export default makeAppRoutes;

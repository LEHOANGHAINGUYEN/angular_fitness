import { makeRoutes } from './config/routes';

import * as UserRedux from './config/redux/user';

const AuthorizationModule = {
  makeRoutes,
  redux: {
    users: UserRedux
  }
};

export default AuthorizationModule;

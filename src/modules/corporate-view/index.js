import { makeRoutes } from './config/routes';
import * as CorporateMemberRedux from './config/redux/member';
import * as CorporateChallengeRedux from './config/redux/challenge';

const CorporateViewModule = {
  makeRoutes,
  redux: {
    members: CorporateMemberRedux,
    challenges: CorporateChallengeRedux
  }
};

export default CorporateViewModule;

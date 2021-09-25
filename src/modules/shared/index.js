import * as MetricRedux from './config/redux/metric';
import * as ChallengeRedux from './config/redux/challenge';
import * as StudioRedux from './config/redux/studio';
import * as MemberRedux from './config/redux/member';

const SharedModule = {
  makeRoutes: () => { },
  redux: {
    metrics: MetricRedux,
    challenges: ChallengeRedux,
    studios: StudioRedux,
    members: MemberRedux
  }
};

export default SharedModule;

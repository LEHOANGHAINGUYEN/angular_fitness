import {makeRoutes} from './config/routes';
import * as MemberRedux from './config/redux/member';
import * as AgendaRedux from './config/redux/agenda';
import * as RosterRedux from './config/redux/roster';
import * as SettingRedux from './config/redux/setting';

const StudioViewModule = {
  makeRoutes,
  redux: {
    members: MemberRedux,
    agendas: AgendaRedux,
    roster: RosterRedux,
    setting: SettingRedux
  }
};

export default StudioViewModule;

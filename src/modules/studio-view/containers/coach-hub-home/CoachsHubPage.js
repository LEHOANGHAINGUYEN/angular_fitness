import React, { useEffect } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './styles.scss';
import CoachHubButton from './components/CoachHubButton';
import LeaderBoardImage from './image/leaderboard.png';
import InputResultImage from './image/input-result.png';
import MemberSearchImage from './image/member-search.png';
import IconLeaderBoardImage from './image/icon3_leaderboard.svg';
import IconInputResultImage from './image/icon2_input-result.svg';
import IconMemberSearchImage from './image/icon1_member-search.svg';


export function CoachsHubPage({ currentStudio, intl, actions, router }) {
  const validateTimeSetup = () => {
    /* eslint-disable */
    const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    /* eslint-enable */
    let message;

    if (!currentStudio.TimeZone) {
      message = intl.formatMessage({ id: 'General.StudioTimeZoneDidNotSetup' });
    } else if (currentStudio.TimeZone !== clientTimeZone) {
      message = intl.formatMessage({ id: 'General.TimeSetupDoesNotMatch' }, { timeZone: currentStudio.TimeZone });
    }

    if (message) {
      setTimeout(() => {
        actions.core_alert.showError(message);
      }, 1000);
    }
  };
  useEffect(() => {
    validateTimeSetup();
  }, []);
  return (
    <div className='coach-hub-page'>
      <div className='button-coach-hub-page'>
        <CoachHubButton
          title={<FormattedMessage id={'Home.Studio.Leaderboard.Btn'} />}
          img={LeaderBoardImage}
          imgIcon={IconLeaderBoardImage}
          handleClick={() => router.push('/studio/leader-board')} />
        <CoachHubButton
          title={<FormattedMessage id={'Home.Studio.InputResults.Btn'} />}
          img={InputResultImage}
          imgIcon={IconInputResultImage}
          handleClick={() => router.push('/studio/input-screen')} />
        <CoachHubButton
          title={<FormattedMessage id={'Home.Studio.MemberSearch.Btn'} />}
          img={MemberSearchImage}
          imgIcon={IconMemberSearchImage}
          handleClick={() => router.push('/studio/member-search')} />
      </div>
    </div>
  );
}
CoachsHubPage.propTypes = {
  actions: PropTypes.any,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired,
  router: PropTypes.object
};

const coachsHubPage = connect(state => ({
  currentStudio: state.auth_users.currentStudio
}))(CoachsHubPage);

export default injectIntl(coachsHubPage);

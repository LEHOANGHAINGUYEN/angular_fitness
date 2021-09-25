import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DateTimeRectangle, DateTimeRectangleType } from 'modules/core/components';
import './styles.scss';

import LeaderBoardButton from 'modules/shared/components/button/LeaderBoardButton';
import OverallLeaderImage from './image/badge_interactiveleaderboard.svg';
import PersonalRecordBreakerImage from './image/metal.svg';
import GlobalLeaderBoardImage from './image/globe (1).svg';


export default function LeaderBoard(props) {
  const isConvention = props.location.query.convention;
  return (
    <div className='leader-board-wapper'>
      <div className='leader-board'>
        <p className='title-leader-board'>
          <FormattedMessage id={isConvention ? 'Home.Studio.Convention.Btn' : 'Home.Studio.Leaderboard.Btn'} />
        </p>
      </div>
      <div className='button-leader-board-wrapper'>
        {!isConvention ? <LeaderBoardButton
          title={<FormattedMessage id={'Leaderboard.Home.PersonalRecord.Btn'} />}
          content={PersonalRecordBreakerImage}
          handleClick={() => props.router.push('/studio/leader-board/today-personal-records')} />
          : ''
        }
        <LeaderBoardButton
          title={<FormattedMessage id={isConvention ? 'Leaderboard.Home.ConventionLeaders.Btn' : 'Leaderboard.Home.TodayChallengeLeader.Btn'} />}
          content={<DateTimeRectangle
            types={DateTimeRectangleType.Date}
            value={new Date()}
            title={moment(new Date()).format('ddd')} />}
          handleClick={() => props.router.push(`/studio/leader-board/today-challenge-leader${isConvention ? '?convention=true' : ''}`)} />
        <LeaderBoardButton
          title={<FormattedMessage id={'Leaderboard.Home.Interactive.Btn'} />}
          content={OverallLeaderImage}
          handleClick={() => props.router.push(`/studio/leader-board/interactive-leader-board${isConvention ? '?convention=true' : ''}`)} />
        <LeaderBoardButton
          title={<FormattedMessage id={'Leaderboard.Home.Global.Btn'} />}
          content={GlobalLeaderBoardImage}
          handleClick={() => props.router.push(`/studio/leader-board/global-leaderboard${isConvention ? '?convention=true' : ''}`)} />
      </div>
    </div>
  );
}
LeaderBoard.propTypes = {
  location: PropTypes.any,
  router: PropTypes.object
};

import React from 'react';
import PropTypes from 'prop-types';

import './styles';

import LeaderBoardButton from 'modules/shared/components/button/LeaderBoardButton';
import InteractiveImage from './image/badge_interactiveleaderboard.svg';
import PersonalRecordBreakerImage from './image/metal.svg';

export default class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='leader-board-corporate'>
        <p className='title-leader-board'>{'Leaderboard'}</p>
        <div className='button-leader-board-wrapper'>
          <LeaderBoardButton title='Interactive Leaderboard' content={InteractiveImage} handleClick={() => this.props.router.push('/corporate/interactive-leader-board')} />
          <LeaderBoardButton title='Personal Record Breakers' content={PersonalRecordBreakerImage} handleClick={() => this.props.router.push('/corporate/personal-record-breaker')} />
        </div>
      </div>
    );
  }
}

LeaderBoard.propTypes = {
  router: PropTypes.object
};

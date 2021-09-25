import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as Helpers from 'common/utils/helpers';
import Constants from 'common/constants/constants';
import { CountMember } from '../../components';
import { Chart, Poster, ListTop } from './components';

import MemberCountImage from './images/icon-member-count.png';
import ParticipantsCountImage from './images/icon-participants-count.png';
import './styles.scss';

export class CoachesHub extends React.Component {
  constructor(props) {
    super(props);
    /*
     * Temporary
      Helpers.exitFullscreen();
    */
  }
  render() {
    let { todayChallenge, challengeTemplate } = this.props;
    let isDriTri = (todayChallenge || {}).ChallengeTemplateId === (challengeTemplate.DriTri || {}).ChallengeTemplateId;
    let metricEntry = todayChallenge.MetricEntry || { Title: '' };
    let title = (metricEntry.Title && metricEntry.EntryType)
      ? `${metricEntry.Title} ${Helpers.getEnumDescription(Constants.EquipmentType, metricEntry.EquipmentId)} for ${metricEntry.EntryType}`
      : undefined;
    let challengeTitle = isDriTri ? 'Dri-Tri' : title || 'No Today Challenge';

    return (
      <div className='coaches-hub'>
        <div className='left-content'>
          <p className='title'>{'Coaches Hub'}</p>
          <div className='member-count'>
            <CountMember className='coaches-hub-member'
              img={MemberCountImage}
              title='Total Orangetheory Member Count'
              number='367,005' />
            <CountMember className='coaches-hub-member'
              img={ParticipantsCountImage}
              title='Total Challenge Participants Count'
              number='196,312' />
          </div>
          <Chart />
        </div>
        <div className='right-content-coaches-hub'>
          <Poster
            title='FITNESS CHALLENGE OF THE DAY'
            type={title ? challengeTitle : 'No Today Challenge'}
            actions={this.props.actions} />
          <ListTop />
        </div>
      </div>
    );
  }
}

CoachesHub.propTypes = {
  actions: PropTypes.any,
  challengeTemplate: PropTypes.object,
  todayChallenge: PropTypes.any
};

export default connect(state => ({
  currentUser: state.auth_users.currentUser,
  user: state.auth_users.user,
  errors: state.auth_users.errors,
  todayChallenge: state.shared_challenges.todayChallenge,
  challengeTemplate: state.shared_challenges.challengeTemplate
}))(CoachesHub);

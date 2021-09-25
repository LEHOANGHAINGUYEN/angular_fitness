import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';

import { ClassDateInfo, CoachInfo, CRInput } from './components';
import './styles.scss';

export function ClassRoster(props) {
  const [mboClassId] = useState(props.location.query.mboClassId);
  const date = moment(props.location.query.date, 'MM/DD/YYYY');
  const currStudio = props.currentStudio;
  useEffect(() => {
    if (!mboClassId || !props.selectedDate) {
      props.actions.routing.navigateTo('/studio/input-screen');
    }
    props.actions.shared_challenges.getChallengeTypes();
    props.actions.studio_roster.selectClass(mboClassId, currStudio.MboStudioId);
    // Load challenge, members and challenge results of members
    props.actions.studio_agendas.updateActiveRoster(true);
    return () => {
      props.actions.studio_roster.clearSelectedClass();
    };
  }, []);
  return (
      <div className='class-roster-wrapper row'>
        <div className='col-sm-12 col-md-12 col-lg-12  top-container'>
          <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-3 date-time-rect-container class-date-info'>
              <ClassDateInfo {...props} date={date} />
            </div>
            <div className='col-sm-12 col-md-12 col-lg-6 roster' />
            <div className='col-sm-12 col-md-12 col-lg-3 coach-info'>
              <CoachInfo {...props} />
            </div>
          </div>
        </div>
        <div className='col-md-12 bottom-container'>
          <CRInput {...props} />
        </div>
      </div>
  );
}
ClassRoster.propTypes = {
  actions: PropTypes.any,
  bikeUnitMeasurement: PropTypes.string,
  challenge: PropTypes.shape({
    ChallengeId: PropTypes.number,
    ChallengeTemplateId: PropTypes.number,
    MetricEntries: PropTypes.array,
    NumberOfRound: PropTypes.number
  }),
  challengeResults: PropTypes.array,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired,
  location: PropTypes.object,
  members: PropTypes.array,
  removeChallengeResultSuccess: PropTypes.bool,
  saveChallengeResultSuccess: PropTypes.bool,
  savedEquipment: PropTypes.object,
  selectedClass: PropTypes.object,
  selectedDate: PropTypes.any,
  striderUnitMeasurement: PropTypes.string,
  treadmillUnitMeasurement: PropTypes.string,
  weightFloorUnitMeasurement: PropTypes.string
};

const classRostera = connect(state => ({
  challenge: state.shared_challenges.todayChallenge,
  challengeResults: state.shared_challenges.challengeResults,
  substituteType: state.shared_challenges.substituteType,
  saveChallengeResultSuccess: state.shared_challenges.saveChallengeResultSuccess,
  data: state.studio_agendas.data,
  isUpsertSucessfully: state.shared_members.isUpsertSucessfully,
  members: state.studio_roster.members,
  errors: state.studio_agendas.errors,
  currentStudio: state.auth_users.currentStudio,
  removeChallengeResultSuccess: state.shared_challenges.removeChallengeResultSuccess,
  selectedClass: state.studio_roster.selectedClass,
  selectedDate: state.studio_agendas.selectedDate,
  weightFloorUnitMeasurement: state.studio_setting.weightFloorUnitMeasurement,
  treadmillUnitMeasurement: state.studio_setting.treadmillUnitMeasurement,
  striderUnitMeasurement: state.studio_setting.striderUnitMeasurement,
  bikeUnitMeasurement: state.studio_setting.bikeUnitMeasurement,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  marathonTypeId: state.shared_challenges.marathonTypeId,
  challengeMemberInfo: state.shared_challenges.challengeMemberInfo,
  isOpenPopup: state.shared_challenges.isOpenPopup,
  initPopup: state.shared_challenges.initPopup,
  isFetchedChallengeMemberInfo: state.shared_challenges.isFetchedChallengeMemberInfo
}))(ClassRoster);

export default injectIntl(classRostera);

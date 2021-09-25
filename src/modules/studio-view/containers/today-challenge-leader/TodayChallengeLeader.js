import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import * as _ from 'lodash';

import Constants from 'common/constants/constants';
import { TCALTable, TCALConventionTable } from './components';
import {
  Calendar
} from 'modules/core/components';
import { ConventionLogo2019 } from 'modules/shared/images';
import PropTypes from 'prop-types';
import helpers, * as Helpers from 'common/utils/helpers';

import './styles.scss';

export class TodayChallengeLeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weightFloorUnitMeasurement: Constants.UnitMeasurementType.Metric,
      unitDistanceMeasurement: Constants.UnitMeasurementType.Metric,
      date: moment(new Date()).format('MM/DD/YYYY')
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { weightFloorUnitMeasurement, challenge } = nextProps;
    if (nextProps.weightFloorUnitMeasurement
      && !_.isEqual(weightFloorUnitMeasurement, prevState.weightFloorUnitMeasurement)) {
      return {
        weightFloorUnitMeasurement: nextProps.weightFloorUnitMeasurement
      };
    }
    if (!_.isEqual(nextProps.treadmillUnitMeasurement, '') && !_.isEqual(challenge, {})) {
      return {
        unitDistanceMeasurement: nextProps.treadmillUnitMeasurement
      };
    }
    return null;
  }

  componentDidMount() {
    const { currentStudio, location } = this.props;
    let isConvention = location.query.convention;
    let studioId = currentStudio.StudioId;
    let date = moment(new Date()).format('MM/DD/YYYY');
    this.props.actions.shared_challenges.getChallengeTypes();
    this.props.actions.shared_challenges.getTodayChallengeAndLeaderboards(studioId, date, null, isConvention);
    this.setState({
      weightFloorUnitMeasurement: this.props.weightFloorUnitMeasurement
    });
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.fetchChallenge) {
      clearInterval(this.fetchChallenge);
    }
    this.props.actions.shared_challenges.clearTodayChallenge();
  }

  handleSwitchChange(value) {
    this.setState({
      isToggleTeam: value
    });
  }

  refreshTodayLeaderboards() {
    const { currentStudio } = this.props;
    // Setup an interval to get challenge of the day
    // At the start of next day, app will fetch challenge
    // and clear leaderboard interval if no challenge
    if (!this.fetchChallenge) {
      const self = this;
      const dayInMilliseconds = (1000 * 60 * 60 * 24) + 1;
      this.fetchChallenge = setInterval(() => {
        const { challenge } = self.props;
        const date = moment(new Date()).format('MM/DD/YYYY');
        const challengeStartDateMoment = challenge.StartDate ? moment(challenge.StartDate) : undefined;

        if (challenge.ChallengeId && challengeStartDateMoment) {
          if (self.interval && moment(new Date()).diff(challengeStartDateMoment, 'days') > 0) {
            clearInterval(self.interval);
          } else if (!self.interval) {
            self.refreshLeaderboardInterval();
          }
        } else if (self.interval) {
          clearInterval(self.interval);
        }

        if (!challenge.ChallengeId
          || challengeStartDateMoment && moment(new Date()).diff(challengeStartDateMoment, 'days') !== 0) {
          self.props.actions.shared_challenges.getTodayChallenge(currentStudio.StudioId, date,
            { isUndergroundReq: true });
        }
      }, dayInMilliseconds);
    }

    this.refreshLeaderboardInterval();
  }

  refreshLeaderboardInterval() {
    const { actions, challenge, currentStudio, location } = this.props;
    let isConvention = location.query.convention;
    const self = this;
    // 5 minute interval
    const leaderboardMilliseconds = 1000 * 60 * 5;
    // Increase leaderboard interval to 15s
    if (!this.interval && challenge.ChallengeId) {
      this.interval = setInterval(() => {
        const date = moment(new Date()).format('MM/DD/YYYY');
        // Clear leaderboard interval if delete challenge
        if (!self.props.challenge.ChallengeId && self.interval) {
          clearInterval(self.interval);
        } else {
          actions.shared_challenges.refreshTodayLeaderboards(currentStudio.StudioId,
            self.props.challenge.ChallengeId,
            date,
            self.props.challenge.ChallengeTemplateId, isConvention);
        }
      }, leaderboardMilliseconds);
    }
  }

  renderTodayChallengeLeaders(isConvention) {
    const { challenge, challengeTemplate } = this.props;
    const metricEntry = challenge.MetricEntry || {};
    const isRowDistance = metricEntry.EntryType === Constants.MetricEntryType.Distance &&
      metricEntry.EquipmentId === Constants.EquipmentType.Row;
    const equipmentId = isRowDistance ? Constants.EquipmentType.Row : metricEntry.EquipmentId;
    let { challengeLeaderBoards } = this.props;
    if ((equipmentId === Constants.EquipmentType.WeightFloor
      && this.state.weightFloorUnitMeasurement === Constants.UnitMeasurementType.Imperial)
      || (metricEntry.EntryType === Constants.MetricEntryType.Distance
        && equipmentId !== Constants.EquipmentType.Row)) {
      const dataLeaderBoard = _.cloneDeep(challengeLeaderBoards);
      challengeLeaderBoards = Helpers.convertDataUnitMeasurement({
        data: dataLeaderBoard,
        challengeType: metricEntry.EntryType,
        unitDistanceMeasurement: equipmentId === Constants.EquipmentType.Treadmill
          ? this.state.unitDistanceMeasurement : Constants.UnitMeasurementType.Metric,
        weightFloorUnitMeasurement: equipmentId === Constants.EquipmentType.WeightFloor
          ? this.state.weightFloorUnitMeasurement : Constants.UnitMeasurementType.Metric
      });
    }
    this.refreshTodayLeaderboards();
    return isConvention ? <TCALConventionTable list={challengeLeaderBoards} challengeTemplate={challengeTemplate} />
      : <TCALTable list={challengeLeaderBoards} challengeTemplate={challengeTemplate} />;
  }
  handleChangeCalendar(newDate) {
    let studioId = this.props.currentStudio.StudioId;
    let { location } = this.props;
    let isConvention = location.query.convention;
    if (moment(newDate).isSame(this.state.date)) {
      return;
    }
    let date = moment(newDate).format('MM/DD/YYYY');
    this.props.actions.shared_challenges.getTodayChallengeAndLeaderboards(studioId, date, null, isConvention);
    this.setState({ date });
  }
  render() {
    let { challenge, intl, location, challengeTemplate } = this.props;
    let challengeTitle = Helpers.getTitleChallenge(challenge.ChallengeTemplateId, challengeTemplate) || intl.formatMessage({ id: 'General.NoChallenge.Title' });
    let isConvention = location.query.convention;
    return (
      <div className='today-challenge'>
        <div>
          <div className='today-challenge-leader'>
            {isConvention && <img src={ConventionLogo2019} className={'logo-convention'} />}
            <div className={`title-today-challenge-leader${isConvention ? ' convention' : ''}`}>
              <p className={`text${isConvention ? ' convention' : ''}`}>
                <FormattedMessage id={isConvention ? 'TodayChallengeLeader.Convention.Title' : 'TodayChallengeLeader.Title'} />
              </p>
              <div className='challenge-date'>
              {!isConvention && <Calendar options={{ format: 'dddd, MMMM Do YYYY' }} onChange={this.handleChangeCalendar.bind(this)} />}
              <div className={`text-type${isConvention ? ' convention' : ''}`}>
                <span className='challenge'>
                  <FormattedMessage id={helpers.getPrefixTitleChallenge(challenge.FitnessTypeId)} />
                  {': '}
                </span> {challengeTitle}
              </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {this.renderTodayChallengeLeaders(isConvention)}
        </div>
      </div>
    );
  }
}

TodayChallengeLeader.propTypes = {
  actions: PropTypes.any,
  challenge: PropTypes.shape({
    ChallengeId: PropTypes.number,
    ChallengeTemplateId: PropTypes.number,
    FitnessTypeId: PropTypes.number,
    MetricEntry: PropTypes.object
  }),
  challengeLeaderBoards: PropTypes.array,
  challengeTemplate: PropTypes.object,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired,
  location: PropTypes.object,
  savedEquipment: PropTypes.object,
  treadmillUnitMeasurement: PropTypes.any,
  weightFloorUnitMeasurement: PropTypes.string
};

const todayChallengeLeader = connect(state => ({
  challenge: state.shared_challenges.todayChallenge,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  challengeLeaderBoards: state.shared_challenges.challengeLeaderBoards,
  currentStudio: state.auth_users.currentStudio,
  errors: state.shared_challenges.errors,
  weightFloorUnitMeasurement: state.studio_setting.weightFloorUnitMeasurement,
  treadmillUnitMeasurement: state.studio_setting.treadmillUnitMeasurement,
  savedEquipment: state.studio_setting.savedEquipment
}))(TodayChallengeLeader);

export default injectIntl(todayChallengeLeader);

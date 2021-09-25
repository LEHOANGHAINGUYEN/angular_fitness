import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import {
  RankTable,
  TableColumn,
  DateTimeRectangle, DateTimeRectangleType, Calendar
} from 'modules/core/components';
import helpers, * as Helpers from 'common/utils/helpers';

import './styles.scss';
import { PanelContainer } from '..';
export class TodayPersonalRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(new Date()).format('MM/DD/YYYY')
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { actions, currentStudio } = nextProps;
    if (Object.keys(nextProps.todayChallenge).length > 0
      && (nextProps.weightFloorUnitMeasurement || nextProps.treadmillUnitMeasurement)) {
      actions.core_table.search({
        url: 'personal/breakers',
        params: {
          additionalQuery: {
            studioId: currentStudio.StudioId,
            date: prevState.date
          }
        },
        isInitial: true
      });
    }
    return null;
  }
  componentDidMount() {
    let studioId = this.props.currentStudio.StudioId;
    let date = moment(new Date()).format('MM/DD/YYYY');
    this.props.actions.shared_challenges.getChallengeTypes();
    if (Object.keys(this.props.todayChallenge).length === 0) {
      this.props.actions.shared_challenges.getTodayChallenge(studioId, date, { isUndergroundReq: true });
    }
  }
  componentWillUnmount() {
    this.props.actions.shared_challenges.destroyChallengeData();
  }
  handleChangeCalendar(newDate) {
    let studioId = this.props.currentStudio.StudioId;
    let date = moment(newDate).format('MM/DD/YYYY');
    if (moment(newDate).isSame(this.state.date)) {
      return;
    }
    this.props.actions.shared_challenges.getTodayChallenge(studioId, date, { isUndergroundReq: true });
    this.setState({ date });
  }
  prevColumnFm(cell) {
    return (
      <p className='text-time border-separation'>
        <label className='time'>{cell}</label>
      </p>
    );
  }

  newColumnFm(cell) {
    return (
      <p className='text-time border-separation'>
        <label className='time'>{cell}</label>
      </p>
    );
  }

  difFormater(cell) {
    return (
      <p className='text-time'>
        <label className='time difTime'>{cell}</label>
      </p>
    );
  }

  challengeFm(cell) {
    return cell ? cell.toUpperCase() : '';
  }

  populateTableColumns() {
    const { intl } = this.props;
    return [
      new TableColumn({
        dataField: 'Rank',
        headerName: intl.formatMessage({ id: 'RankTable.RankColumn.Header' }),
        isKey: true
      }),
      new TableColumn({
        dataField: 'MemberName',
        headerName: intl.formatMessage({ id: 'RankTable.NameColumn.Header' })
      }),
      new TableColumn({
        dataField: 'ChallengeName',
        headerName: intl.formatMessage({ id: 'PersonalBenchmarks.PerformanceHistory.Challenge' }),
        dataAlign: 'center',
        width: '230px',
        dataFormat: this.challengeFm
      }),
      new TableColumn({
        dataField: 'EquipmentName',
        headerName: intl.formatMessage({ id: 'PersonalBenchmarks.Equipment.Title' }),
        dataAlign: 'center',
        dataFormat: this.challengeFm
      }),
      new TableColumn({
        dataField: 'UnitOfMeasure',
        headerName: 'UOM',
        dataAlign: 'center',
        dataFormat: this.challengeFm
      }),
      new TableColumn({
        dataField: 'PreviousRecord',
        headerName: intl.formatMessage({ id: 'PersonalRecord.PreviousPR.Title' }),
        dataFormat: this.prevColumnFm,
        dataAlign: 'center'
      }),
      new TableColumn({
        dataField: 'NewRecord',
        headerName: intl.formatMessage({ id: 'PersonalRecord.NewPR.Title' }),
        dataFormat: this.newColumnFm,
        dataAlign: 'center'
      }),
      new TableColumn({
        dataField: 'DiffRecord',
        headerName: intl.formatMessage({ id: 'PersonalRecord.Difference.Title' }),
        dataFormat: this.difFormater,
        dataAlign: 'center',
        className: 'records-difference'
      })
    ];
  }

  render() {
    const { todayChallenge, intl, challengeTemplate } = this.props;
    const { LogoUrl } = todayChallenge;
    const challengeTitle = Helpers.getTitleChallenge(todayChallenge.ChallengeTemplateId, challengeTemplate) || intl.formatMessage({ id: 'General.NoChallenge.Title' });
    return (
      < div className='personal-record'>
        <PanelContainer
          leftPanel={(
            <div className='wrapper'>
              <div className='title-personal-breaker'>
                <p className='text-title-personal-breaker'><FormattedMessage id={'PersonalRecord.Title'} /></p>
                <Calendar options={{ format: 'dddd, MMMM Do YYYY' }} onChange={this.handleChangeCalendar.bind(this)} />
              </div>
              <div className='date-time-rect-container'>
                <DateTimeRectangle type={DateTimeRectangleType.Date}
                  value={this.state.date}
                  title={moment(this.state.date).format('ddd')} />
              </div>
              <div className='border-bottom' />
              <div className='text-type'>
                <span className='challenge'>
                  {intl.formatMessage({ id: helpers.getPrefixTitleChallenge(todayChallenge.FitnessTypeId) })}
                  {':'}
                </span><br />{<FormattedMessage id={challengeTitle} />}
              </div>
              <div className='icon-equipment'>
                {challengeTitle === intl.formatMessage({ id: 'General.NoChallenge.Title' }) ? undefined :
                  <img src={LogoUrl} className='img-icon' />}
              </div>
            </div>
          )}
          rightPanel={(
            <div>
              <div className='personal-records-table bootstrap-table'>
                <RankTable
                  actions={this.props.actions}
                  columns={this.populateTableColumns()}
                  noReset={true}
                  enableSearch={true} />
              </div>
            </div>
          )} />
      </div>
    );
  }
}

TodayPersonalRecords.propTypes = {
  actions: PropTypes.any,
  challengeTemplate: PropTypes.object,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired,

  todayChallenge: PropTypes.shape({
    ChallengeId: PropTypes.number,
    ChallengeTemplateId: PropTypes.number,
    FitnessTypeId: PropTypes.number,
    LogoUrl: PropTypes.any,
    MetricEntry: PropTypes.object
  }),
  treadmillUnitMeasurement: PropTypes.string,
  weightFloorUnitMeasurement: PropTypes.string
};

const todayPersonalRecords = connect(state => ({
  todayChallenge: state.shared_challenges.todayChallenge,
  currentStudio: state.auth_users.currentStudio,
  weightFloorUnitMeasurement: state.studio_setting.weightFloorUnitMeasurement,
  treadmillUnitMeasurement: state.studio_setting.treadmillUnitMeasurement,
  challengeTemplate: state.shared_challenges.challengeTemplate
}))(TodayPersonalRecords);

export default injectIntl(todayPersonalRecords);

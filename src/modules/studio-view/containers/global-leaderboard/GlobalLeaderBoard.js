import React from 'react';
import { PanelContainer } from '..';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import {
  RankTable,
  TableColumn, FormSelect,
  DateTimeRectangle, DateTimeRectangleType, Calendar
} from 'modules/core/components';
import helpers, * as Helpers from 'common/utils/helpers';
import { Constants } from 'common';
import './styles';

export class GlobalLeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.configArea = Constants.paginationArea.default;
    this.state = {
      date: moment(new Date()).format('MM/DD/YYYY'),
      pageArea: this.configArea.pageArea
    };
    this.handleChangeArea = this.handleChangeArea.bind(this);
  }
  componentDidMount() {
    this.props.actions.shared_challenges.getChallengeTypes();
  }
  componentWillReceiveProps(newProps) {
    const { actions, currentStudio } = this.props;
    if (Object.keys(newProps.todayChallenge).length > 0) {
      actions.core_table.search({
        url: 'studio/getStudioAverages',
        params: {
          additionalQuery: {
            division: this.state.pageArea,
            studioid: currentStudio.StudioId,
            challengeId: newProps.todayChallenge.ChallengeId
          }
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.shared_challenges.destroyChallengeData();
  }

  challengeGlobalFm(cell) {
    return cell.toUpperCase();
  }

  studioAverageFm(cell) {
    return (
      <p className='text-average'>
        <label className='diffAverage'>{cell}</label>
      </p>
    );
  }
  studioDifferenceFm(cell) {
    return (
      <p className='text-difference'>
        <label>{cell}</label>
      </p>
    );
  }

  handleChangeArea(e) {
    const { actions, currentStudio, todayChallenge } = this.props;
    actions.core_table.search({
      url: 'studio/getStudioAverages',
      params: {
        additionalQuery: {
          division: e.value,
          studioid: currentStudio.StudioId,
          challengeId: todayChallenge.ChallengeId
        }
      }
    });
    this.setState({
      pageArea: e.value
    });
  }
  populateTableColumns() {
    const { intl } = this.props;
    return [
      new TableColumn({
        dataField: 'rank',
        headerName: intl.formatMessage({ id: 'RankTable.RankColumn.Header' }),
        isKey: true,
        dataAlign: 'center',
        width: '100px'
      }),
      new TableColumn({
        dataField: 'studioName',
        headerName: intl.formatMessage({ id: 'RankTable.StudioColumn.Header' }),
        width: '138px',
        dataFormat: this.challengeGlobalFm,
        dataAlign: 'center'
      }),
      new TableColumn({
        dataField: 'studioAverage',
        headerName: intl.formatMessage({ id: 'RankTable.StudioAverageColumn.Header' }),
        dataAlign: 'center',
        dataFormat: this.studioAverageFm
      })
    ];
  }

  populateTableColumnsGlobal() {
    return [
      new TableColumn({
        dataField: 'rank',
        isKey: true,
        dataAlign: 'center',
        width: '100px'
      }),
      new TableColumn({
        dataField: 'studioName',
        width: '138px',
        dataFormat: this.challengeGlobalFm,
        dataAlign: 'center'
      }),
      new TableColumn({
        dataField: 'studioAverage',
        dataAlign: 'center',
        dataFormat: this.studioAverageFm
      })
    ];
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

  render() {
    const { todayChallenge, intl, challengeTemplate } = this.props;
    const { LogoUrl } = todayChallenge;
    const challengeTitle = Helpers.getTitleChallenge(todayChallenge.ChallengeTemplateId, challengeTemplate) || intl.formatMessage({ id: 'General.NoChallenge.Title' });
    $('#table-search').focus(
      function () {
        $(this).val('');
      });
    return (
      < div className='global-leaderboard'>
        <PanelContainer
          leftPanel={(
            <div className='wrapper'>
              <div className='title-global-leaderboard'>
                <p className='text-title-global-leaderboard'><FormattedMessage id={'PersonalRecord.Global.Title'} /></p>
                <Calendar options={{ format: 'dddd, MMMM Do YYYY' }} onChange={this.handleChangeCalendar.bind(this)} />
              </div>
              <div className='date-time-rect-container'>
                <DateTimeRectangle type={DateTimeRectangleType.Date}
                  value={this.state.date}
                  title={moment(this.state.date).format('ddd')} />
              </div>
              <div className='border-bottom' />
              <div className='text-type'>
                <span>
                  {intl.formatMessage(
                    { id: helpers.getPrefixTitleChallenge(todayChallenge.FitnessTypeId) }
                  )}
                  {':'}
                </span><br />
                {<FormattedMessage id={challengeTitle} />}
              </div>
              <div className='icon-equipment'>
                {challengeTitle === intl.formatMessage({ id: 'General.NoChallenge.Title' }) ? undefined :
                  <img src={LogoUrl} className='img-icon' />}
              </div>
            </div>
          )}
          rightPanel={(
            <div>
              <div className='global-leaderboard-table bootstrap-table '>
                <div className='global-page-dropdown'>
                  <FormSelect
                    async={false}
                    className='custom-global-page'
                    searchable={false}
                    options={this.configArea.pageAreas}
                    value={this.state.pageArea}
                    onChange={this.handleChangeArea} />
                </div>
                <RankTable
                  actions={this.props.actions}
                  columns={this.populateTableColumns()}
                  column={this.populateTableColumnsGlobal()}
                  enableSearch={true}
                  isGlobal={true} />
              </div>
            </div>
          )} />
      </div>
    );
  }
}
GlobalLeaderBoard.propTypes = {
  actions: PropTypes.any,
  challengeTemplate: PropTypes.object,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired,
  todayChallenge: PropTypes.shape({
    ChallengeId: PropTypes.number,
    ChallengeTemplateId: PropTypes.number,
    FitnessTypeId: PropTypes.number,
    MetricEntry: PropTypes.object,
    LogoUrl: PropTypes.any
  })
};

const globalLeaderBoard = connect((state) => ({
  todayChallenge: state.shared_challenges.todayChallenge,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  currentStudio: state.auth_users.currentStudio
}))(GlobalLeaderBoard);
export default injectIntl(globalLeaderBoard);


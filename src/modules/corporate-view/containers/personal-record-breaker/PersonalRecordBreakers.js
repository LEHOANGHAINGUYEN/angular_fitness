import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

import { Back } from '../../components';
import * as Helpers from 'common/utils/helpers';
import ClockImage from './images/Timer-Icon.svg';
import Constants from 'common/constants/constants';
import { RankTable, TableColumn, TableSearch, Calendar } from 'modules/core/components';
import { DivisionFilter } from 'modules/shared/components';


import './styles';

export class PersonalRecordBreakers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: {
        studioId: '',
        division: Constants.Division.Global,
        date: moment(new Date()).format('MM/DD/YYYY')
      }
    };
  }
  componentWillReceiveProps(newProps) {
    const { actions } = this.props;
    if ((newProps.todayChallenge && newProps.todayChallenge !== this.props.todayChallenge)
      || Object.keys(this.props.todayChallenge).length > 0) {
      let additionalQuery = {
        studioId: this.state.select.studioId,
        date: this.state.select.date
      };
      actions.core_table.search({
        url: 'personal/breakers',
        params: { additionalQuery }
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.shared_challenges.destroyChallengeData();
  }

  handleChangeCalendar(newDate) {
    let select = this.state.select;
    select.date = moment(newDate).format('MM/DD/YYYY');
    this.setState({ select });
    this.props.actions.shared_challenges.getTodayChallenge(select.studioId, select.date, { isUndergroundReq: true });
  }

  onStudioChange(studioId) {
    if (studioId) {
      let select = this.state.select;
      select.studioId = studioId;
      this.setState({ select });
      this.props.actions.shared_challenges.getTodayChallenge(studioId, this.state.select.date,
        { isUndergroundReq: true });
    }
  }

  onDivisionChange(divisionType, key, value) {
    let selectState = this.state.select;
    if (!key || !value) {
      selectState.studioId = '';
      selectState.regionCode = '';
      selectState.countryCode = '';
      selectState.division = '';
    } else {
      selectState[key] = value;
      selectState.division = divisionType;
    }
    selectState[key] = value;
    selectState.division = divisionType;
    this.setState({
      select: selectState
    }, () => {
      if (selectState.division !== Constants.Division.Studio
        || (selectState.division === Constants.Division.Studio && selectState.studioId)) {
        this.props.actions.shared_challenges.getTodayChallenge(this.state.select.date,
            { isUndergroundReq: true });
      }
    });
  }
  prevColumnFm(cell) {
    return (
      <p className='text-time border-separation'>
        <img src={ClockImage} className='clock' />
        {' Previous PR’s'}
        <span className='time'>{cell}</span>
      </p>
    );
  }

  newColumnFm(cell) {
    return (
      <p className='text-time border-separation'>
        <img src={ClockImage} className='clock' />
        {' New PR’s'}
        <span className='time'>{cell}</span>
      </p>
    );
  }

  difFormater(cell) {
    return (
      <p className='text-time'>
        <img src={ClockImage} className='clock' />
        {' Difference'}
        <span className='time dif-time'>{cell}</span>
      </p>
    );
  }

  populateTableColumns() {
    return [
      new TableColumn({
        dataField: 'Rank',
        headerName: 'Rank',
        isKey: true
      }),
      new TableColumn({
        dataField: 'MemberName',
        headerName: 'Name'
      }),
      new TableColumn({
        dataField: 'PreviousRecord',
        headerName: 'Previous Record',
        dataFormat: this.prevColumnFm
      }),
      new TableColumn({
        dataField: 'NewRecord',
        headerName: 'New Record',
        dataFormat: this.newColumnFm
      }),
      new TableColumn({
        dataField: 'DiffRecord',
        headerName: 'Difference Record',
        dataFormat: this.difFormater
      })
    ];
  }
  render() {
    let { todayChallenge, challengeTemplate } = this.props;
    const {division} = this.state.select;
    let isDriTri = todayChallenge.ChallengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId;
    let metricEntry = todayChallenge.MetricEntry || { Title: '' };
    let title = (metricEntry.Title && metricEntry.EntryType)
      ? `${metricEntry.Title} ${Helpers.getEnumDescription(Constants.EquipmentType, metricEntry.EquipmentId)} for ${metricEntry.EntryType}`
      : undefined;
    let challengeTitle = isDriTri ? 'Dri-Tri' : title || 'No Today Challenge';
    return (
      <div className='personal-record-breaker-wapper'>
        <div className='personal-record-breaker'>
          <div className='row top'>
            <div className='col-md-12 title'>
              <h3><Back />{'Personal Record Breakers'}</h3>
            </div>
          </div>
          <div className='table-container row'>
            <div className='col-md-2'>
              <label className='title-challenge'>{title ? `Challenge: ${challengeTitle}` : 'No Today Challenge'}</label>
            </div>
            <div className='col-md-9'>
              <div className='col-md-4 col-studio'>
                <label className={`${division !== Constants.Division.Global ? 'division' : ''}`}>{'Division'}</label>
                <DivisionFilter
                  actions={this.props.actions}
                  onChange={this.onDivisionChange.bind(this)}
                  isChallenge={true} />
              </div>
              {/* <div className='col-md-2 col-studio'>
                <label>{'Individual Studios'}</label>
                <FormStudioSelect actions={this.props.actions} onChange={this.onStudioChange.bind(this)} />
              </div> */}
              <div className='col-md-2 col-date'>
                <label>{'Date'}</label>
                <Calendar onChange={this.handleChangeCalendar.bind(this)} />
              </div>
              <div className='search-box col-md-2'>
                <TableSearch
                  actions={this.props.actions}
                  searchFields={['MemberName']}
                  fullTextSearch={false}
                  placeholder='Member Search' />
              </div>
            </div>
            <div className='line-horizontal' />
          </div>
          <div className='panel-filter'>
            <div className='bootstrap-table'>
              <RankTable
                actions={this.props.actions}
                columns={this.populateTableColumns()} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
PersonalRecordBreakers.propTypes = {
  actions: PropTypes.any,
  challengeTemplate: PropTypes.object,
  todayChallenge: PropTypes.shape({
    ChallengeId: PropTypes.number,
    ChallengeTemplateId: PropTypes.number,
    MetricEntry: PropTypes.object
  })
};
export default connect(state => ({
  todayChallenge: state.shared_challenges.todayChallenge,
  challengeTemplate: state.shared_challenges.challengeTemplate
}))(PersonalRecordBreakers);

/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as _ from 'lodash';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import Qty from 'js-quantities';
import { Constants, SelectOptionsConstants, Helpers } from 'common';
import {
  Calendar,
  FormSelect,
  FormTagSelect,
  FormTagSelectType,
  TableSearch
} from 'modules/core/components';
import { DivisionFilter } from 'modules/shared/components';
import './styles.scss';

class LeaderboardFilter extends React.Component {
  constructor(props) {
    super(props);
    const {
      studio,
      isConvention,
      challengeTemplate,
      classOption
    } = props;
    this.state = {
      url: `challenge-leader/interactive${isConvention ? '/convention' : ''}`,
      select: {
        ageGroupId: '',
        equipmentId: Constants.EquipmentType.Row,
        challengeTemplateId: challengeTemplate.DriTri.ChallengeTemplateId,
        challengeTemplateTypeId: -1,
        date: moment(new Date()).format('MM/DD/YYYY'),
        division: !studio
          ? Constants.Division.Global
          : Constants.Division.Studio,
        studioId: !studio ? undefined : studio.StudioId,
        genderId: Constants.GenderType.All,
        classId: classOption.length === 0 ? 'All' : ((classOption || [])[0] || {}).value
      },
      todayChallenge: {},
      challengeTemplate: props.challengeTemplate,
      weightFloorUnitMeasurement: '',
      isCollapse: false
    };

    this.selectedDate = moment(new Date()).format('MM/DD/YYYY');
    this.leaderBoardFilterRef = React.createRef();
  }

  componentWillReceiveProps(newProps) {
    const { noChallenge, challengeTemplate } = this.props;
    const metricEntry = newProps.todayChallenge.MetricEntry || {};
    const challengeTemplateId = newProps.todayChallenge.ChallengeTemplateId
      ? newProps.todayChallenge.ChallengeTemplateId
      : challengeTemplate.DriTri.ChallengeTemplateId;
    const fullMarathon = challengeTemplate.MarathonMonth.ChallengeTemplateTypes;
    const challengeTemplateTypeId = `${newProps.todayChallenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId
      ? fullMarathon[0].ChallengeTemplateTypeId : 'isOriginal'}`;
    const equipmentId = metricEntry.EquipmentId;
    const entryType = metricEntry.EntryType;
    const newState = prevState => {
      return {
        select: {
          ...prevState.select,
          challengeTemplateId,
          challengeTemplateTypeId,
          equipmentId: equipmentId || Constants.EquipmentType.Row,
          entryType
        },
        challengeTemplate: newProps.challengeTemplate,
        todayChallenge: newProps.todayChallenge
      };
    };

    if (
      ((newProps.weightFloorUnitMeasurement &&
        newProps.weightFloorUnitMeasurement !== this.props.weightFloorUnitMeasurement)
        || (newProps.treadmillUnitMeasurement &&
          !_.isEqual(
            newProps.treadmillUnitMeasurement,
            this.props.treadmillUnitMeasurement
          ))) &&
      !_.isEqual(this.state.todayChallenge, {})
    ) {
      this.setState({
        weightFloorUnitMeasurement: newProps.weightFloorUnitMeasurement
      }, () => {
        this.handleFilter();
      });
    }
    if (newProps.gettingChallenge) {
      return;
    }
    if (newProps.noChallenge !== noChallenge) {
      this.setState(newState, () => {
        this.props.onFilterCallback({
          challengeTemplateId: newProps.todayChallenge.ChallengeTemplateId,
          challengeTemplate: newProps.challengeTemplate
        });
      });
    } else if (
      !_.isEqual(this.state.todayChallenge, newProps.todayChallenge)
      || !_.isEqual(this.props.challengeTemplate, newProps.challengeTemplate) || this.ableFilter
    ) {
      this.setState(newState, () => {
        this.props.onFilterCallback({
          challengeTemplateId: newProps.todayChallenge.ChallengeTemplateId,
          challengeTemplate: newProps.challengeTemplate
        });
        this.handleFilter();
        this.ableFilter = false;
      });
    }
  }

  componentWillUnmount() {
    this.props.actions.shared_challenges.destroyChallengeData();
  }
  /**
   * Perform filter
   */
  handleFilter() {
    const { select, challengeTemplate } = this.state;
    const { todayChallenge } = this.props;
    const ageGroupId =
      !select.ageGroupId || select.genderId === Constants.GenderType.All
        ? undefined
        : select.ageGroupId;
    const equipmentId =
      todayChallenge.ChallengeTemplateId === challengeTemplate.OrangeVoyage.ChallengeTemplateId
        ? Constants.EquipmentType.Row
        : select.equipmentId;
    const entryType = !select.entryType ? undefined : select.entryType;
    const challengeTemplateId = select.challengeTemplateId;
    const challengeTemplateTypeId = Helpers.getInitChallengeTemplateTypeId(select.challengeTemplateId,
      challengeTemplate)
      && select.challengeTemplateTypeId !== 'isOriginal' ? select.challengeTemplateTypeId : undefined;
    const isOriginal = select.challengeTemplateTypeId === 'isOriginal' ? true : undefined;
    const date = select.date;
    // Marathon and OrangaVoyage get record with no division
    const division =
      select.challengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId ||
        select.challengeTemplateId === challengeTemplate.OrangeVoyage.ChallengeTemplateId
        ? undefined
        : select.division;
    const studioId = select.studioId;
    const genderId =
      select.genderId === Constants.GenderType.All
        ? undefined
        : select.genderId;
    const regionCode = !select.regionCode ? undefined : select.regionCode;
    const countryCode = !select.countryCode ? undefined : select.countryCode;
    const classId =
      !moment(todayChallenge.StartDate).isSame(todayChallenge.EndDate, 'day') ||
        !select.classId ||
        select.classId === 'All'
        ? undefined
        : select.classId;
    const additionalQuery = {
      ageGroupId,
      equipmentId,
      entryType,
      challengeTemplateId,
      challengeTemplateTypeId,
      date,
      division,
      studioId,
      genderId,
      regionCode,
      countryCode,
      classId,
      isOriginal
    };
    this.props.actions.core_table.search({
      isResetPage: true,
      url: this.state.url,
      params: { additionalQuery },
      isInitial: true
    });
  }

  /**
   * Handle event when user change calendar value
   * @param {Date} date The date value that selected by user
   * @param {*} calendarName The calendar name
   */
  async handleChangeCalendar(newDate) {
    const { classOption } = this.props;
    let selectState = this.state.select;

    if (moment(newDate).isSame(selectState.date)) {
      return;
    }
    selectState.date = moment(newDate).format('MM/DD/YYYY');
    await this.props.actions.core_table.destroyData();
    await this.props.actions.shared_challenges.destroyHomeStudioAverage();
    this.ableFilter = true;
    await this.props.actions.shared_challenges.getTodayChallenge(
      this.props.studio.StudioId,
      this.state.select.date,
      {
        isUndergroundReq: true,
        isInteractiveLeaderboard: true
      }
    );
    selectState.classId = classOption.length === 0 ? 'All' : ((classOption || [])[0] || {}).value;
    this.setState({ select: selectState });
    this.props.actions.shared_challenges.getClassTimeOptions(selectState.studioId, selectState.date);
  }

  handleOnRadioChange(genderId) {
    return function () {
      let selected = this.state.select;
      selected.genderId = genderId;
      this.setState({ select: selected }, () => {
        this.handleFilter();
      });
    }.bind(this);
  }

  /**
   * Populate select option value based on event name
   * @param {string} name Specify the name of select option
   * @param {*} newValue Specify next value of this select option
   */
  populateSelectOnSelectChange(name, newValue) {
    const { challengeTemplate } = this.props;
    const metricEntry = this.props.todayChallenge.MetricEntry || {};
    let selectState = this.state.select;
    selectState[name] = (newValue || {}).value;
    // If equipment select is changed, reset metric value
    if (name === 'division') {
      selectState.countryId = undefined;
    } else if (name === 'challengeTemplateId') {
      const ct = Helpers.getChallengeTemplateById(newValue.value, challengeTemplate);
      if (ct.ChallengeTemplateTypes.length > 0) {    
       if (newValue.value === challengeTemplate.MarathonMonth.ChallengeTemplateId) { 
          selectState.challengeTemplateTypeId = ct.ChallengeTemplateTypes[0].ChallengeTemplateTypeId;
       } else {
          selectState.equipmentId = metricEntry.EquipmentId;
          selectState.challengeTemplateTypeId = 'isOriginal';
        }
      } else {
        selectState.equipmentId = Constants.EquipmentType.Row;
        selectState.challengeTemplateTypeId = '';
      }
    }
    return selectState;
  }

  /**
   * Handle select change event
   * @param {string} name The name of select
   */
  handleSelectChange(name) {
    const { onFilterCallback, challengeTemplate } = this.props;
    return function (newValue) {
      let selectState = this.populateSelectOnSelectChange(name, newValue);
      this.setState(
        {
          select: selectState
        },
        () => {
          // Reset studioId
          if (name === 'division') {
            selectState = this.state.select;
            selectState.studioId = undefined;
            this.setState({
              select: selectState
            });
          }
          if (name === 'challengeTemplateId') {
            onFilterCallback({
              challengeTemplateId: newValue.value,
              challengeTemplate
            });
          }
          this.handleFilter();
        }
      );
    }.bind(this);
  }
  /**
   * Handle select age group and metric
   */
  handleFormTagSelectChange(type, value) {
    let field;
    if (type === FormTagSelectType.Age) {
      field = 'ageGroupId';
    }
    let selectState = this.state.select;
    selectState[field] = value;
    this.setState(
      {
        select: selectState
      },
      () => {
        this.handleFilter();
      }
    );
  }

  /**
   *
   * Detect studio change
   *
   */
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
    this.setState(
      {
        select: selectState
      },
      () => {
        this.handleFilter();
      }
    );
  }

  sortMetricTagData(tagA, tagB) {
    let valueA = new Qty(tagA.label.toLowerCase());
    let valueB = new Qty(tagB.label.toLowerCase());
    return valueA.compareTo(valueB);
  }

  renderSubTypeOptions() {
    const { challengeTemplate } = this.props;
    const { challengeTemplateId } = this.state.select;
    const ct = Helpers.getChallengeTemplateById(challengeTemplateId, challengeTemplate);
    let listChallengeType = (ct.ChallengeTemplateTypes || []).map(challengeType => {
      return {
        label: Helpers.findDiffString(ct.TemplateName, challengeType.TemplateTypeName).trim(),
        value: challengeType.ChallengeTemplateTypeId
      };
    });
    if (listChallengeType.length > 0) {
      if (challengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId) {
        listChallengeType = [{
          label: `${ct.TemplateName}`,
          value: 'isOriginal'
        },
        ...listChallengeType
        ];
        return {
          list: listChallengeType,
          key: 'Interactive.Filter.ChallengeSubType'
        };
      }
      if (challengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId) {
        listChallengeType = [
          ...listChallengeType,
          {
            label: `${ct.TemplateName}`,
            value: 'isOriginal'
          }
        ];
        return {
          list: listChallengeType,
          key: 'Interactive.Filter.ChallengeSubType'
        };
      }
      listChallengeType = [{
        label: `${ct.TemplateName} 2G`,
        value: 'isOriginal'
      },
      ...listChallengeType
      ];
      return {
        list: listChallengeType,
        key: 'Interactive.Filter.ClassSize'
      };
    }
    return undefined;
  }

  dataToggle = () => {
    this.props.dataToggle();
    this.setState(state => {
      return {
        ...state,
        isCollapse: !state.isCollapse
      };
    });
  };
  render() {
    const {
      intl,
      studio,
      gettingChallenge,
      challengeTemplate,
      actions,
      classOption,
      todayChallenge
    } = this.props;
    let {
      select: {
        challengeTemplateId,
        challengeTemplateTypeId,
        genderId,
        equipmentId,
        classId,
        ageGroupId
      }
    } = this.state;
    const metricEntry = todayChallenge.MetricEntry || { Title: '' };
    const isRowDistance = metricEntry.EntryType === Constants.MetricEntryType.Distance &&
      metricEntry.EquipmentId === Constants.EquipmentType.Row;
    const challengeCategorySelect = Helpers.createListChallengeTemplate(challengeTemplate);
    if (todayChallenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId) {
      challengeTemplateTypeId = Helpers.isNumber(challengeTemplateTypeId)
        ? parseInt(challengeTemplateTypeId) : challengeTemplateTypeId;
    }
    return (
      <div className='interactive-leader-board-filter' ref={this.leaderBoardFilterRef}>
        <div className='filter-item'>
          <FormattedMessage id={'Interactive.Filter.Search.Placeholder'}>
            {ph => (
              <TableSearch
                actions={actions}
                fullTextSearch={false}
                searchFields={['name']}
                className={'table-search-input'}
                placeholder={ph} />
            )}
          </FormattedMessage>
        </div>
        <div className='filter-item'>
          <label className='title-filter'>
            <FormattedMessage id={'Interactive.Filter.Date'} />
          </label>
          <div className='calendar-container'>
            <Calendar onChange={this.handleChangeCalendar.bind(this)} />
          </div>
        </div>
        {!gettingChallenge &&
          challengeTemplateId !== challengeTemplate.MarathonMonth.ChallengeTemplateId &&
          challengeTemplateId !== challengeTemplate.OrangeVoyage.ChallengeTemplateId && (
            <div className='filter-item'>
              <label className='title-filter'>
                <FormattedMessage id={'Interactive.Filter.ClassTime'} />
              </label>
              <FormSelect
                name='classId'
                className='select-class-time'
                async={false}
                value={classId}
                options={classOption}
                onChange={this.handleSelectChange('classId')}
                searchable={false} />
            </div>
          )}
        <div className='filter-item'>
          <label className='title-filter'>
            <FormattedMessage id={'Interactive.Filter.ChallengeType'} />
          </label>
          <FormSelect
            async={false}
            value={challengeTemplateId}
            options={challengeCategorySelect}
            onChange={this.handleSelectChange('challengeTemplateId')}
            searchable={false} />
        </div>
        {this.renderSubTypeOptions() && (
          <div className='filter-item'>
            <label className='title-filter'>
              <FormattedMessage id={this.renderSubTypeOptions().key} />
            </label>
            <FormSelect
              async={false}
              value={challengeTemplateTypeId}
              options={this.renderSubTypeOptions().list}
              onChange={this.handleSelectChange('challengeTemplateTypeId')}
              searchable={false} />
          </div>
        )}
        {!studio && (
          <div className='filter-item'>
            <label className='title-filter'>
              <FormattedMessage id={'Interactive.Filter.Division'} />
            </label>
            <DivisionFilter
              actions={actions}
              onChange={this.onDivisionChange.bind(this)} />
          </div>
        )}
        <div className='filter-item'>
          <label className='title-filter'>
            <FormattedMessage id={'Interactive.Filter.Gender'} />
          </label>
          <div className='list-radio'>
            <input
              id='1'
              type='radio'
              name='radio-button'
              checked={genderId === Constants.GenderType.All ? true : false}
              onChange={this.handleOnRadioChange(Constants.GenderType.All)} />
            <label
              htmlFor='1'
              className={`radio-inline ${
                genderId === Constants.GenderType.All ? 'checked' : ''
                }`}>
              <span />
              {intl.formatMessage({ id: 'General.All.Title' })}
            </label>
            <input
              id='2'
              type='radio'
              name='radio-button'
              checked={genderId === Constants.GenderType.Women ? true : false}
              onChange={this.handleOnRadioChange(Constants.GenderType.Women)} />
            <label
              htmlFor='2'
              className={`radio-inline ${
                genderId === Constants.GenderType.Women ? 'checked' : ''
                }`}>
              <span />
              {intl.formatMessage({ id: 'TodayChallengeLeader.WomenLabel' })}
            </label>
            <input
              id='3'
              type='radio'
              name='radio-button'
              checked={genderId === Constants.GenderType.Men ? true : false}
              onChange={this.handleOnRadioChange(Constants.GenderType.Men)} />
            <label
              htmlFor='3'
              className={`radio-inline ${
                genderId === Constants.GenderType.Men ? 'checked' : ''
                }`}>
              <span />
              {intl.formatMessage({ id: 'TodayChallengeLeader.MenLabel' })}
            </label>
            {genderId !== Constants.GenderType.All && (
              <div>
                <label className='select-label-group'>
                  <FormattedMessage id={'Interactive.Filter.SelectAge'} />
                </label>
                <FormTagSelect
                  type={FormTagSelectType.Age}
                  data={SelectOptionsConstants.AgeGroup}
                  selectedValue={ageGroupId}
                  onChange={this.handleFormTagSelectChange.bind(this)}
                  searchable={false} />
              </div>
            )}
          </div>
        </div>
        {!isRowDistance && (
          <div className='filter-item'>
            <label className='title-filter'>
              <FormattedMessage id={'Interactive.Filter.SortEquipment'} />
            </label>
            <FormSelect
              async={false}
              value={equipmentId}
              options={SelectOptionsConstants.EquipmentTypeOptions}
              onChange={this.handleSelectChange('equipmentId')}
              searchable={false}
              intl={intl}
              onOpen={() => {
                setTimeout(() => {
                  this.leaderBoardFilterRef.current.scrollTop = this.leaderBoardFilterRef.current.scrollHeight;
                }, 100);
              }} />
          </div>
        )}
      </div>
    );
  }
}
/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
LeaderboardFilter.propTypes = {
  actions: PropTypes.any,
  challengeTemplate: PropTypes.object,
  challengeTemplateType: PropTypes.object,
  classOption: PropTypes.array,
  dataToggle: PropTypes.any,
  gettingChallenge: PropTypes.bool,
  intl: intlShape.isRequired,
  isConvention: PropTypes.bool,
  metrics: PropTypes.array,
  noChallenge: PropTypes.bool,
  onFilterCallback: PropTypes.func,
  savedEquipment: PropTypes.object,
  studio: PropTypes.object,
  tableData: PropTypes.array,
  todayChallenge: PropTypes.object,
  treadmillUnitMeasurement: PropTypes.any,
  weightFloorUnitMeasurement: PropTypes.string
};

export default injectIntl(
  connect(state => ({
    metrics: state.shared_metrics.metrics,
    studio: state.auth_users.currentStudio,
    todayChallenge: state.shared_challenges.todayChallenge,
    gettingChallenge: state.shared_challenges.loading,
    noChallenge: state.shared_challenges.noChallenge,
    tableData: state.core_table.data,
    weightFloorUnitMeasurement: state.studio_setting.weightFloorUnitMeasurement,
    treadmillUnitMeasurement: state.studio_setting.treadmillUnitMeasurement,
    savedEquipment: state.studio_setting.savedEquipment,
    challengeTemplate: state.shared_challenges.challengeTemplate,
    challengeTemplateType: state.shared_challenges.challengeTemplateType,
    classOption: state.shared_challenges.classesOpt
  }))(LeaderboardFilter)
);

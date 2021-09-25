/**
 * React / Redux dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as _ from 'lodash';

import { Calendar, FormSelect } from 'modules/core/components';
import { DivisionFilter } from 'modules/shared/components';
import { Constants, SelectOptionsConstants, Helpers } from 'common';
import './styles.scss';

export class ChallengeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: {
        division: Constants.Division.Global,
        startDate: new Date(),
        endDate: new Date(),
        challengeTypeId: Constants.ChallengeType.All,
        equipmentId: Constants.EquipmentType.All
      }
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.equipmentTypeOptions = _.cloneDeep(SelectOptionsConstants.EquipmentTypeOptions);
    this.equipmentTypeOptions.unshift({
      value: Constants.EquipmentType.All,
      label: 'All'
    });
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
    });
  }
  /**
   * Perform filter
   */
  handleFilter() {
    let startDate = moment(this.state.select.startDate).format('MM/DD/YYYY');
    let endDate = moment(this.state.select.endDate).format('MM/DD/YYYY');
    let division = this.state.select.division;
    let studioId = this.state.select.studioId;
    let regionCode = !this.state.select.regionCode ? undefined : this.state.select.regionCode;
    let countryCode = !this.state.select.countryCode ? undefined : this.state.select.countryCode;
    let equipmentId = !this.state.select.equipmentId ||
      this.state.select.equipmentId === Constants.EquipmentType.All ? undefined : this.state.select.equipmentId;
    let challengeTemplateId = !this.state.select.challengeTypeId ||
      this.state.select.challengeTypeId === Constants.EquipmentType.All ? undefined : this.state.select.challengeTypeId;

    let additionalQuery = {
      equipmentId,
      challengeTemplateId,
      startDate,
      endDate,
      division,
      studioId,
      regionCode,
      countryCode
    };
    this.props.actions.shared_challenges.filterChallenge(additionalQuery);
  }

  /**
   * Handle event when user change calendar value
   * @param {Date} date The date value that selected by user
   * @param {*} calendarName The calendar name
   */
  handleChangeCalendar(startDate, endDate) {
    let selectState = this.state.select;
    selectState.startDate = startDate;
    selectState.endDate = endDate;
    this.setState({ select: selectState });
  }

  /**
   * Handle select change event
   * @param {string} name The name of select
   */
  handleSelectChange(name) {
    return function (newValue) {
      let selectState = this.state.select;
      selectState[name] = newValue.value;
      this.setState({
        select: selectState
      });
    }.bind(this);
  }

  /**
   * Return template of challenges filter component
   * Studio Location filter
   * Start Date
   * End Date
   * Fitness Equipment
   */
  render() {
    const format = 'MM/DD/YYYY, hh:mm A';
    const multiDate = true;
    const isGlobal = this.state.select.division !== Constants.Division.Global ? 'col-md-4' : 'col-md-2';
    const { challengeTemplate } = this.props;
    const challengeCategorySelect = Helpers.createListChallengeTemplate(challengeTemplate);
    return (
      <div className='challenge-filter row'>
        <div className={isGlobal}>
          <label className='division'>{'Division'}</label>
          <DivisionFilter
            actions={this.props.actions}
            onChange={this.onDivisionChange.bind(this)}
            isChallenge={true} />
        </div>
        <div className='col-md-2'>
          <label className='division'>{'Select Time Frame'}</label>
          <Calendar options={{ format, multiDate }} onChange={this.handleChangeCalendar.bind(this)} />
        </div>
        <div className='col-md-2'>
          <label>{'Challenge Type'}</label>
          <FormSelect
            async={false}
            value={this.state.select.challengeTypeId}
            options={[{ label: 'All', value: 'All' }, ...challengeCategorySelect]}
            onChange={this.handleSelectChange('challengeTypeId')} />
        </div>
        <div className='col-md-2'>
          <label />
          <button className='btn btn-secondary' onClick={this.handleFilter.bind(this)}>{'Search'}</button>
        </div>
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
ChallengeFilter.propTypes = {
  actions: PropTypes.any,
  challengeTemplate: PropTypes.object
};

export default ChallengeFilter;

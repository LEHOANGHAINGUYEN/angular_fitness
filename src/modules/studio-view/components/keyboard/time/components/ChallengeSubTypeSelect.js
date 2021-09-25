import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {Constants, Helpers} from 'common';
export default class ChallengeSubTypeSelect extends Component {
  constructor(props) {
    super(props);
  }

  // Check the member was reached the challenge goal or not.
  isReachedGoal() {
    const { selectedSubType, options, challengeMemberInfo} = this.props;
    const selectedObj = _.find(options, ['value', selectedSubType]);
    const goal = Constants.MarathonMonthGoal[selectedObj.label.replace(/\s/g, '')];
    return _.round(parseFloat((challengeMemberInfo || {}).TotalResults) / Constants.CoefficientUnitMeasurement.Distance, 3) >= goal;
  }
  
  renderSubTypes(options) {
    const { selectedSubType, onSelectSubType, hideIndicator, challengeTemplate } = this.props;
    return options.map((subType, index) => {
      const typeName = Helpers.findDiffString(challengeTemplate.TemplateName, subType.label).trim().toUpperCase();
      return <div className='col-md-4 round-wrapper orange' key={index}>
        {selectedSubType === subType.value && !hideIndicator ? <div className='triangle-dritri' /> : ''}
        {hideIndicator && <i className={`fa fa-star orange-star${(selectedSubType === subType.value && this.isReachedGoal()) ? '' : ' disabled'}`} />}
        <p className={`round-dritri-txt${selectedSubType === subType.value ? ' selected' : ''}${hideIndicator ? ' marathon-month' : ''}`} onClick={() => onSelectSubType(subType.value)}>
          {hideIndicator ? typeName : subType.label}</p>
      </div>;
    });
  }
  render() {
    const { options, hideIndicator } = this.props;
    return (
      <div className={`challenge-sub-type custom-scrollbar${hideIndicator ? ' marathon-month' : ''}`}>
        {this.renderSubTypes(options)}
      </div>
    );
  }
}

ChallengeSubTypeSelect.propTypes = {
  challengeMemberInfo: PropTypes.object,
  challengeTemplate: PropTypes.object,
  hideIndicator: PropTypes.bool,
  onSelectSubType: PropTypes.func,
  options: PropTypes.array,
  selectedSubType: PropTypes.number
};


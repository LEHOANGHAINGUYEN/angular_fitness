import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';

import { FormSelect } from 'modules/core/components';
import { FormStudioSelect } from 'modules/shared/components';

import './styles.scss';
import { AppConstants, Constants } from 'common';

export class DivisionFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      divisionType: Constants.Division.Global,
      select: {
        regionCode: '',
        countryCode: '',
        studioId: ''
      }
    };
  }

  handleTypeChange(e) {
    this.setState({
      divisionType: e.value,
      select: {
        studioId: '',
        regionCode: '',
        countryCode: ''
      }
    }, () => {
      this.onThisChange();
    });
  }

  handleValueChange(name) {
    return function (ev) {
      let select = this.state.select;
      select[name] = ev.value;
      this.setState({
        select
      });
      this.onThisChange();
    }.bind(this);
  }

  onStudioChange(studioId) {
    if (studioId) {
      let select = this.state.select;
      select.studioId = studioId;
      this.setState({
        select
      });
      this.onThisChange();
    }
  }

  onThisChange() {
    let divisionType = this.state.divisionType;
    let select = this.state.select;
    let key;
    let value;

    switch (divisionType) {
      case Constants.Division.Studio:
        key = 'studioId';
        value = select[key];
        break;
      case Constants.Division.Regional:
        key = 'regionCode';
        value = select[key];
        break;
      case Constants.Division.National:
        key = 'countryCode';
        value = select[key];
        break;
      default:
    }
    this.props.onChange(divisionType, key, value);
  }

  render() {
    const { intl } = this.props;
    let isChallenge = this.props.isChallenge && this.state.divisionType !== Constants.Division.Global ? 'col-md-6' : '';
    return (
      <div className='division-container'>
        <div className={`filter-item ${isChallenge}`}>
          <FormSelect
            async={false}
            value={this.state.divisionType}
            intl={intl}
            options={AppConstants.division}
            onChange={this.handleTypeChange.bind(this)}
            searchable={false} />
        </div>
        {this.state.divisionType === Constants.Division.Studio && (
          <div className={`filter-item ${isChallenge}`}>
            <FormStudioSelect
              actions={this.props.actions}
              onChange={this.onStudioChange.bind(this)} />
          </div>
        )}
        {this.state.divisionType === Constants.Division.Regional && (
          <div className={`filter-item ${isChallenge}`}>
            <FormSelect
              async={false}
              name='regionCode'
              placeholder={intl.formatMessage({id: 'Interactive.Filter.SelectRegional.Placeholder'})}
              value={this.state.select.regionCode}
              options={AppConstants.challengeFormSelect.divisionRegional}
              onChange={this.handleValueChange('regionCode')}
              searchable={true} />
          </div>
        )}
        {this.state.divisionType === Constants.Division.National && (
          <div className={`filter-item ${isChallenge}`}>
            <FormSelect
              async={false}
              name='countryCode'
              placeholder={intl.formatMessage({id: 'Interactive.Filter.SelectNational.Placeholder'})}
              value={this.state.select.countryCode}
              options={AppConstants.challengeFormSelect.country}
              onChange={this.handleValueChange('countryCode')}
              searchable={true} />
          </div>
        )}
      </div>
    );
  }
}
DivisionFilter.propTypes = {
  actions: PropTypes.any,
  intl: intlShape.isRequired,
  isChallenge: PropTypes.bool,
  onChange: PropTypes.func
};

export default injectIntl(DivisionFilter);

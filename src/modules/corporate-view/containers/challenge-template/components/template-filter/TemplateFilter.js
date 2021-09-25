/**
 * React / Redux dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Constants } from 'common/constants/constants';
import { FormSelect } from 'modules/core/components';
import './styles.scss';

export class TemplateFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: {
        fitnessTypeId: 'All'
      }
    };
    this.handleFilterTemplate = this.handleFilterTemplate.bind(this);
  }
  componentWillMount() {
    this.handleFilterTemplate();
  }
  /**
   * Perform filter
   */
  handleFilterTemplate() {
    let fitnessTypeId = !this.state.select.fitnessTypeId ||
      this.state.select.fitnessTypeId === Constants.EquipmentType.All ? undefined : this.state.select.fitnessTypeId;
    let additionalQuery = {
      fitnessTypeId
    };
    this.props.actions.shared_challenges.filterChallengeTemplate(additionalQuery);
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
      this.handleFilterTemplate();
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
    return (
      <div className='challenge-filter row'>
        <div className='col-md-2'>
          <label>{'Type'}</label>
          <FormSelect
            async={false}
            value={this.state.select.fitnessTypeId}
            options={this.props.fitnessTypeOptions || []}
            onChange={this.handleSelectChange('fitnessTypeId')} />
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
TemplateFilter.propTypes = {
  actions: PropTypes.any,
  fitnessTypeOptions: PropTypes.array
};
export default TemplateFilter;

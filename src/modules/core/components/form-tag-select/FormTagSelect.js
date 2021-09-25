import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import _ from 'lodash';
export class FormTagSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Handle on tag is selected
   */
  handleOnClick(value) {
    let { onChange, type } = this.props;
    if (onChange && typeof onChange === 'function') {
      onChange(type, value);
    }
  }
  render() {
    let { selectedValue, data, zeroData, intl } = this.props;

    let result = _.uniqBy(data, 'value');
    if (result.length === 0) {
      return (
        <div className={this.props.className || ''}>
          {zeroData ||
            intl.formatMessage({ id: 'Interactive.Filter.SelectMetricNoItem' })}
        </div>
      );
    }

    return (
      <div className='age-group'>
        {result.map((item, index) => {
          return (
            <button
              key={index}
              className={`btn btn-primary${
                selectedValue === item.value ? ' active' : ''
              }`}
              onClick={this.handleOnClick.bind(this, item.value)}>
              {item.label}
            </button>
          );
        })}
        <button
          key={-1}
          className={`btn btn-primary${!selectedValue ? ' active' : ''}`}
          onClick={this.handleOnClick.bind(this, '')}>
          {intl.formatMessage({ id: 'General.All.Title' })}
        </button>
      </div>
    );
  }
}
/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
FormTagSelect.propTypes = {
  actions: PropTypes.any,
  className: PropTypes.string,
  data: PropTypes.array,
  intl: intlShape.isRequired,
  onChange: PropTypes.func,
  selectedValue: PropTypes.any,
  type: PropTypes.string,
  zeroData: PropTypes.string
};

export default injectIntl(FormTagSelect);

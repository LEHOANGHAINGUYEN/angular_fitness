import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import './styles.scss';

export class Switch extends React.Component {
  constructor(props) {
    super(props);

    const { checkedValue, defaultValue } = props;
    const defaultValueChecked = _.isUndefined(defaultValue) ? true : defaultValue;
    this.state = {
      value: _.isUndefined(checkedValue) ? defaultValueChecked : checkedValue
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps && newProps.defaultValue && newProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: newProps.defaultValue
      });
    }
  }

  /**
   * Handle on switch is changed
   */
  handleSwitchChange(newValue) {
    const { onChange, onSwitchChange } = this.props;

    // Check if newValue === previousValue then return (do nothing)
    if (newValue === this.state.value) {
      return;
    }

    // Trigger this function for case: Redux form
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }

    // For case custom event handler
    if (onSwitchChange && typeof onSwitchChange === 'function') {
      onSwitchChange(newValue);
    }

    // Say react for updating the value from state
    this.setState({ value: newValue });
  }

  render() {
    const { value } = this.state;
    const { checkedValue, checkedLabel, uncheckedValue, uncheckedLabel } = this.props;
    const isCheckButtonActive =
      (_.isUndefined(checkedValue) && value === true) ||
      value === checkedValue;

    return (
      <div className={`switch-container ${this.props.className ? this.props.className : ''}`}>
        <button
          className={`switch-button${isCheckButtonActive ? ' active' : ''}`}
          onClick={this.handleSwitchChange.bind(this, !_.isUndefined(checkedValue) ? checkedValue : true)}>
          {checkedLabel}
        </button>
        <button
          className={`switch-button${!isCheckButtonActive ? ' active' : ''}`}
          onClick={this.handleSwitchChange.bind(this, !_.isUndefined(uncheckedValue) ? uncheckedValue : false)}>
          {uncheckedLabel}
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
Switch.propTypes = {
  checkedLabel: PropTypes.string.isRequired,
  checkedValue: PropTypes.any,
  className: PropTypes.string,
  defaultValue: PropTypes.bool,
  onChange: PropTypes.func,
  onSwitchChange: PropTypes.func,
  uncheckedLabel: PropTypes.string.isRequired,
  uncheckedValue: PropTypes.string
};

export default Switch;

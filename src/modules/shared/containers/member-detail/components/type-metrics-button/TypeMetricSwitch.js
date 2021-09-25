import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export class TypeMetricSwitch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type, isSelected, onSelect, name, logoUrl } = this.props;
    return (
      <div
        className={`type-metric-switch${isSelected ? ' selected' : ''}`}
        onClick={() => onSelect(type)}>
        <img src={logoUrl} />
        <div className='name'>
          {name}
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
TypeMetricSwitch.propTypes = {
  isSelected: PropTypes.bool,
  logoUrl: PropTypes.string,
  name: PropTypes.any,
  onSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

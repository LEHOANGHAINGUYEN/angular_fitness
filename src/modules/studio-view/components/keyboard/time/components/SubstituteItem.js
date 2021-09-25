import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const SubstituteItem = ({isSelected, icon, onSelect, classNameIcon, name}) => {
  return (
    <div className={`substitute-type${isSelected ? ' selected' : ''}`} onClick={onSelect}>
      <img src={icon} className={classNameIcon} />
      <div className='substitute-name'>
        <FormattedMessage id={name} />
      </div>
    </div>
  );
};

SubstituteItem.propTypes = {
  classNameIcon: PropTypes.string,
  icon: PropTypes.any,
  isSelected: PropTypes.bool,
  name: PropTypes.string,
  onSelect: PropTypes.func
};

export default SubstituteItem;

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export const TimeButton = memo(function TimeButton(props) {
  return (
    <div className='time-button' onClick={props.handleClick}>
      <p className='time'>{props.time}</p>
      <p className='name'>{props.name}</p>
    </div>
  );
});

TimeButton.propTypes = {
  handleClick: PropTypes.func,
  name: PropTypes.string,
  time: PropTypes.string
};
export default TimeButton;

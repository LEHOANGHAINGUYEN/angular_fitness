import React from 'react';
import PropTypes from 'prop-types';

import '../styles';
export default function CoachHubButton({ handleClick, imgIcon, title }) {
  return (
    <div className='coach-hub-button' onClick={() => handleClick()}>
      <div className='coach-hub-button-top' >
        <img src={imgIcon} />
      </div>
      <div className='coach-hub-button-bottom'>
        <p className='text-coach-hub-button'>
          <span>{title}</span>
        </p>
      </div>
    </div>
  );
}
CoachHubButton.propTypes = {
  handleClick: PropTypes.func,
  imgIcon: PropTypes.any,
  title: PropTypes.object
};

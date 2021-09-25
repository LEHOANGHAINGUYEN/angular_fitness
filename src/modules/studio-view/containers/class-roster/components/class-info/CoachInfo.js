import React from 'react';
import PropTypes from 'prop-types';

import { IconCoach } from 'modules/shared/images';

export default function CoachInfo({ selectedClass }) {
  const renderCoachName = () => {
    if (!selectedClass) { return undefined; }
    return selectedClass.coachDisplayname;
  };
  return (
    <div>
      <img src={IconCoach} className='coach-img' />
      <p className='coach-name'>
        {renderCoachName()}
      </p>
    </div>
  );
}
CoachInfo.propTypes = {
  selectedClass: PropTypes.object
};


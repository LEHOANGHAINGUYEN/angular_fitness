import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DateTimeRectangle, DateTimeRectangleType } from 'modules/core/components';
import { locale as defaultLocale } from 'localization';

export default function ClassDateInfo({ selectedClass, date }) {
  const renderClassTime = () => {
    if (!selectedClass) { return undefined; }
    return moment(selectedClass.classStartDateTime).locale(defaultLocale).format('LT');
  };
  return (
    <div>
      <DateTimeRectangle type={DateTimeRectangleType.Date}
        value={date}
        title={moment(date.toDate()).format('ddd')} />
      <div className='class-time-name'>
        <div className='time'>{renderClassTime()}</div>
        <div className='name'>{(selectedClass || {}).name}</div>
      </div>
      <div className='border-bottom' />
    </div>
  );
}
ClassDateInfo.propTypes = {
  date: PropTypes.any,
  selectedClass: PropTypes.object
};

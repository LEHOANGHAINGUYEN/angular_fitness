import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import { DateTimeRectangleType } from './DateTimeRectangleType';

import './style';

export class DateTimeRectangle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type, value, title } = this.props;
    // TBD
    // const formatValue = moment(value).format('L').replace(new RegExp(`[^\.]?${moment().format('YYYY')}.?`), '');
    const formatValue = type !== 'Year' ? moment(value).format('MM/DD') : moment(value).format('MM/DD/YYYY');
    let innerTitle;

    switch (type) {
      case DateTimeRectangleType.Date:
        innerTitle = <FormattedMessage id={'General.Date.Title'}/>;
        break;
      case DateTimeRectangleType.Time:
        innerTitle = <FormattedMessage id={'General.Time.Title'}/>;
        break;
      default:
        innerTitle = <FormattedMessage id={'General.Date.Title'}/>;
        break;
    }

    if (title) {
      innerTitle = title;
    }

    return (
        <div className='date-wapper'>
          <div className='content-left ellipse'>{'●'}</div>
          <div className='content-right ellipse'>{'●'}</div>
          <div className='content'><label>{innerTitle}</label><br/>
            <span className='date'>{formatValue}</span>
          </div>
        </div>
    );
  }
}

DateTimeRectangle.propTypes = {
  format: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any
};

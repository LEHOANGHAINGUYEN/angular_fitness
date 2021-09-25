import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import * as _ from 'lodash';

import * as Helpers from 'common/utils/helpers';
import { Constants } from 'common';
import {
  Calendar,
  DateTimeRectangle,
  DateTimeRectangleType
} from 'modules/core/components';
import TimeButton from './components/time-button/TimeButton';
import { PanelContainer } from '..';
import { locale as defaultLocale } from 'localization';

import './styles.scss';
export function InputScreen(props) {
  const defaultFormat = 'MM/DD/YYYY, hh:mm A';
  const clearMemberStorageByDate = () => {
    let memberResult = Helpers.getDataInLocalStorage(Constants.MemberResultKey);
    let memberResultFilter = _.filter(memberResult, function (o) {
      return o.date === moment(new Date()).format('MM/DD/YYYY');
    });
    localStorage.setItem(Constants.MemberResultKey, JSON.stringify(memberResultFilter));
  };
  useEffect(() => {
    clearMemberStorageByDate();
    return () => {
      props.actions.studio_agendas.updateActiveRoster(false);
      props.actions.studio_agendas.clearClassTime();
    };
  }, []);
  const selectTime = (obj) => {
    let date = moment(props.selectedDate).format('MM/DD/YYYY');
    let id = obj.mboClassId;
    props.router.push(`${props.location.pathname}/class-roster?mboClassId=${id}&date=${date}&time=${moment(obj.classStartDateTime).format('hh:mm A')}`);
  };
  const getSchedule = (date) => {
    let currStudio = props.currentStudio;
    let currDate = moment(date).format('YYYY/MM/DD');
    props.actions.studio_agendas.getClassesByMboStudio(currStudio.MboStudioId, currDate, currStudio.StudioId);
  };
  const handleChange = (newDate) => {
    props.actions.studio_agendas.clearClassTime();
    getSchedule(newDate);
    props.actions.studio_agendas.selectDate(newDate);
  };
  let classTime = props.schedules || [];
  let tds = [];
  let trs = [];
  for (let i = 0; i < classTime.length; i++) {
    if (tds.length < 4) {
      tds.push(<td className='td-time' key={`${i}_col`}>
        <TimeButton value={classTime[i].mboClassId}
          time={moment(classTime[i].classStartDateTime).locale(defaultLocale).format('LT')}
          handleClick={selectTime.bind(this, classTime[i])}
          name={classTime[i].className} />
      </td>);
    } else {
      trs.push(<tr key={i}>{tds}</tr>);
      tds = [];
      tds.push(<td className='td-time' key={`${i}_col`}>
        <TimeButton value={classTime[i].mboClassId}
          time={moment(classTime[i].classStartDateTime).locale(defaultLocale).format('LT')}
          handleClick={selectTime.bind(this, classTime[i])}
          name={classTime[i].className} /></td>);
    }
    if ((i + 1) >= classTime.length) {
      trs.push(<tr key={i + 1}>{tds}</tr>);
      break;
    }
  }
  const currDate = props.selectedDate || new Date();
  const selectedDateSession = localStorage.getItem(Constants.SelectedDateKey);
  const selectedDate = selectedDateSession && !_.isNull(selectedDateSession) && !_.isEqual(selectedDateSession, 'null')
    ? new Date(JSON.parse(localStorage.getItem(Constants.SelectedDateKey))) : new Date();

  return (
    <div className='input-screen'>
      <PanelContainer
        leftPanel={(
          <div className='wrapper'>
            <div className='date-time-rect-container'>
              < DateTimeRectangle type={DateTimeRectangleType.Date}
                value={currDate}
                title={moment(currDate).format('ddd')} />
            </div>
            <div className='calendar-container'>
              <Calendar onChange={handleChange.bind(this)}
                options={{
                  inline: true,
                  format: defaultFormat,
                  selectedDate: props.isRosterActive ? props.selectedDate : selectedDate
                }} />
            </div>
          </div>
        )}
        rightPanel={(
          <div>
            <div className='title'>
              <p className='select-time'><FormattedMessage id={'InputResults.SelectTime.Title'} /></p>
            </div>
            <table className='time-input'>
              <tbody>
                {trs}
              </tbody>
            </table>
          </div>
        )} />
    </div>
  );
}
InputScreen.propTypes = {
  actions: PropTypes.any,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired,
  isRosterActive: PropTypes.bool,
  location: PropTypes.any,
  router: PropTypes.any,
  schedules: PropTypes.any,
  selectedDate: PropTypes.any
};

const inputScreen = connect(state => ({
  schedules: state.studio_agendas.schedules,
  members: state.studio_agendas.members,
  selectedDate: state.studio_agendas.selectedDate,
  errors: state.studio_agendas.errors,
  currentStudio: state.auth_users.currentStudio,
  isRosterActive: state.studio_agendas.isRosterActive
}))(InputScreen);

export default injectIntl(inputScreen);

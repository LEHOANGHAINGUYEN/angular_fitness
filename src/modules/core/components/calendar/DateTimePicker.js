import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import 'eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js';
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css';
import * as _ from 'lodash';
import { Helpers } from 'common';

export class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  componentDidMount() {
    let that = this;
    const { editAble, resetDefaultDate } = this.props.inputProps ? this.props.inputProps : {};
    if (!editAble) {
      this.props.options.ignoreReadonly = true;
    }

    let options = {
      ...this.props.options,
      defaultDate: this.props.options.date,
      date: !resetDefaultDate ? this.props.options.date : undefined
    };

    $(`#datetimepicker${this.guid}`).datetimepicker(options);


    $(`#datetimepicker${this.guid}`).on('dp.change', (e) => {
      that.props.onChange(e.date);
    });
  }

  /* eslint-disable react/no-deprecated */
  componentWillUpdate(nextProps) {
    const { options: { date, minDate, format }, inputProps } = this.props;
    if (!date && inputProps.resetDefaultDate) { return; }
    const nextDate = nextProps.options.date;
    moment.DATETIME_LOCAL = format || 'DD-MM-YYYY';
    let formatedDate = typeof date === 'string' ?
      date :
      moment().format(moment.DATETIME_LOCAL);
    let formatedNextDate = typeof nextDate === 'string' ?
      nextDate :
      moment(nextDate).format(nextProps.options.format);

    if (formatedNextDate !== formatedDate) {
      $(`#datetimepicker${this.guid}`).data('DateTimePicker').date(formatedNextDate);
    }

    if (nextProps.options.minDate !== minDate) {
      $(`#datetimepicker${this.guid}`).data('DateTimePicker').minDate(nextProps.options.minDate);
      if (formatedNextDate < minDate) {
        $(`#datetimepicker${this.guid}`).data('DateTimePicker').date(nextProps.options.minDate);
      }
    }
  }
  inputChange(id) {
    $(id).bind('keypress', function(e) {
      let inputLength = e.target.value.length;
      if ((inputLength === 2 || inputLength === 5) && e.keyCode !== 47) {
        let input = e.target.value;
        if (input.charAt(input.length - 1) !== '/') {
          input += '/';
        } else if (input.split('/').length === 2) {
          input = `0${input}`;
        } else if (input.split('/').length === 3) {
          input = `${input.substr(0, 3)}0${input.substr(3)}`;
        }
        $(e.target).val(input);
      }
    });
  }
  render() {
    this.guid = Helpers.guid();
    const { options, isMultiday } = this.props;
    const { editAble, placeholder } = this.props.inputProps ? this.props.inputProps : {};
    const isChallengeMultiday = !_.isUndefined(isMultiday) && !isMultiday;
    return (
      <div className='datetime-picker-wrapper'>
        {
          !options.inline ? (<div className='input-group date' id={`datetimepicker${this.guid}`}>
            <input id={`calendarInput${this.guid}`} type='text' className={`form-control${isChallengeMultiday ? ' disabled-calendar-input' : ''}`}
              maxLength={10}
              readOnly={!editAble ? 'readonly' : undefined}
              placeholder={placeholder} disabled={isChallengeMultiday}
              onKeyPress={() => this.inputChange.bind(this)(`#calendarInput${this.guid}`)}/>
            <span id={`calendarBtn${this.guid}`} className={`input-group-addon${isChallengeMultiday ? ' disabled-calendar-btn' : ''}`}>
              <span className='glyphicon glyphicon-calendar' />
            </span>
          </div>) :
            (<div className='input-group date' id={`datetimepicker${this.guid}`} />)
        }
      </div>
    );
  }
}

DateTimePicker.propTypes = {
  inputProps: PropTypes.object,
  isMultiday: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.object
};

export default DateTimePicker;

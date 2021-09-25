import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import 'daterangepicker/daterangepicker.js';

import * as Helpers from 'common/utils/helpers';

export class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.format = this.props.options.format || 'MM/DD/YYYY';
    this.getDateRange = this.getDateRange.bind(this);
  }

  componentDidMount() {
    let propsOption = this.props.options;

    if (propsOption.startDate && propsOption.endDate) {
      this.startDate = propsOption.startDate;
      this.endDate = propsOption.endDate;
    } else {
      this.startDate = moment(new Date());
      this.endDate = moment(new Date());
    }
    this.generateToInput();

    let that = this;
    $(`#datetimepicker${this.guid}`).daterangepicker({ autoApply: true });

    $('.input-mini').keypress(function (e) {
      if (e.which === 13) {
        $('.daterangepicker')[0].style.display = 'none';
        $(this).blur();
      }
    });

    $('.input-mini').on('focusout', function () {
      let dataRangePicker = $(`#datetimepicker${that.guid}`).data('daterangepicker');
      that.getDateRange(dataRangePicker.startDate, dataRangePicker.endDate);
    });

    $(`#datetimepicker${this.guid}`).on('apply.daterangepicker', function (ev, picker) {
      that.getDateRange(picker.startDate, picker.endDate);
    });
  }

  getDateRange(startDate, endDate) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.generateToInput();
  }
  generateToInput() {
    $(`#input${this.guid}`).val(`${this.startDate.format(this.format)} - ${this.endDate.format(this.format)}`);
    this.props.onChange(this.startDate, this.endDate);
  }

  render() {
    this.guid = Helpers.guid();
    const { editAble } = this.props.inputProps ? this.props.inputProps : {};
    return (
      <div className='datetime-picker-wrapper'>
        <div className='input-group date'>
          <input className='form-control' id={`input${this.guid}`} readOnly={!editAble ? 'readonly' : undefined} />
          <span id={`datetimepicker${this.guid}`} className='input-group-addon'>
            <span className='glyphicon glyphicon-calendar' />
          </span>
        </div>
      </div>
    );
  }
}

DateRangePicker.propTypes = {
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  options: PropTypes.object
};


export default DateRangePicker;

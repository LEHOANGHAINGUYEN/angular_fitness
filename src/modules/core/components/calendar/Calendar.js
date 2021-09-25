import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Currently, the challenge tracker app is supporting localization (fr and es)
// So that we should add fr and es locales for calendar
import 'moment/locale/fr';
import 'moment/locale/es';

import DateTimePicker from './DateTimePicker';
import DateRangePicker from './DateRangePicker';
// TBD
// import CalendarFormat from './CalendarFormat';
import './styles.scss';

const defaultFormat = 'dddd, MM/DD/YYYY';

export class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const options = this.props.options || {};
    const { selectedDate } = options;
    const { resetDefaultDate } = this.props.inputProps || {};
    if (!resetDefaultDate) {
      this.handleOnCalendarChange(selectedDate || new Date());
    }
  }

  /**
   * Handle on calendar is changed
   * Handle for two cases: Redux form and custom onChange function
   */
  handleOnCalendarChange(newDate) {
    // Get props from Field Redux Form
    const { input } = this.props;
    const onChange = (input || {}).onChange;

    if (typeof onChange === 'function') {
      onChange(newDate);
    }

    // Emmit the onChange function that is passed from component
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(newDate);
    }
  }

  render() {
    const options = this.props.options || {};
    const { inline, multiDate, format, mode, selectedDate, minDate, maxDate } = options;

    return (
      <div className='date-time-picker'>
        {!multiDate ?
          (<DateTimePicker
            options={{
              date: selectedDate || new Date(),
              locale: this.props.locale,
              inline: inline || false,
              viewMode: mode || 'days',
              // TBD
              // format: CalendarFormat.getCalendarFormat(moment.locale()) || defaultFormat,
              format: format || defaultFormat,
              minDate,
              maxDate
            }}
            isMultiday={this.props.isMultiday}
            onChange={this.handleOnCalendarChange.bind(this)}
            inputProps={this.props.inputProps} />) :
          (<DateRangePicker
            options={{}}
            onChange={this.props.onChange}
            inputProps={this.props.inputProps} />)}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Calendar.propTypes = {
  input: PropTypes.object, // The props under the input key are what connects your input component to Redux
  inputProps: PropTypes.object,
  isMultiday: PropTypes.bool,
  locale: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.object
};

export default connect(state => ({
  locale: state.core_language.locale
}))(Calendar);

import React from 'react';
import PropTypes from 'prop-types';

import './styles';
import {
  TotalMemberCount,
  ParticipatingMemberCount,
  RepeatUsage, ReportFilter
} from './components';

export default class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: ''
    };
  }

  handleFilter(url, additionalQuery) {
    if (additionalQuery.reportType === 'RepeatUsage') {
      this.props.actions.core_table.search({
        url,
        params: additionalQuery
      });
    }
    this.setState({
      type: additionalQuery.reportType
    });
  }

  selectTime(event) {
    let time = event.target.value;
    let date = this.state.date;
    this.props.router.push(`${this.props.location.pathname}/class-roster?date=${date}&time=${time}`);
  }

  handleChangeCalendar = (newDate) => {
    let selectState = this.state.select;
    selectState.date = newDate;
    this.setState({ select: selectState });
  }

  render() {
    let content;
    switch (this.state.type) {
      case 'Total_Member_Count':
        {
          content = <TotalMemberCount />;
          break;
        }
      case 'Participating_Member_Count':
        {
          content = <ParticipatingMemberCount />;
          break;
        }
      case 'Repeat_Usage':
        {
          content = <RepeatUsage actions={this.props.actions} />;
          break;
        }
      default:
        {
          content = <TotalMemberCount />;
          break;
        }
    }
    return (
      <div className='corporate-report'>
        <div className='reports'>
          <div className='title-report'>
            <p className='text'>{'Reports'}</p>
          </div>
          <ReportFilter
            handleFilter={this.handleFilter.bind(this)}
            actions={this.props.actions} />
          {content}
        </div>
        <div className='button-export'>
          <p className='text-export'>{'EXPORT TO *CSV'}</p>
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  actions: PropTypes.any,
  location: PropTypes.any,
  router: PropTypes.any
};

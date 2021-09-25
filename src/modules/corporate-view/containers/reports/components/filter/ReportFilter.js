import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import './styles.scss';
import { AppConstants } from 'common';
import { Calendar, TableSearch } from 'modules/core/components';
import { FormStudioSelect } from 'modules/shared/components';

export default class ReportFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'corporate/reports',
      select: {
        type: 'Total_Member_Count',
        startDate: new Date(),
        endDate: new Date(),
        fitnessEquipment: ''
      }
    };
  }

  componentDidMount() {
    this.handleFilter();
  }

  handleSelectChange(name) {
    return function (newValue) {
      let selectState = this.state.select;
      selectState[name] = newValue.value;
      this.setState({
        select: selectState
      }, () => this.handleFilter());
    }.bind(this);
  }

  handleChangeCalendar = (newDate) => {
    let selectState = this.state.select;
    selectState.date = newDate;
    this.setState({ select: selectState });
    this.handleFilter();
  }

  handleChangeMultiCalendar(startDate, endDate) {
    let selectState = this.state.select;
    selectState.startDate = startDate;
    selectState.endDate = endDate;
    this.setState({ select: selectState });
  }

  handleFilter() {
    let reportType = this.state.select.type;
    let fitnessEquipment = this.state.select.equipmentId;
    let startDate = this.state.select.startDate;
    let endDate = this.state.select.endDate;
    let additionalQuery = {
      reportType,
      fitnessEquipment,
      startDate,
      endDate
    };
    this.props.handleFilter(this.state.url, additionalQuery);
  }

  render() {
    const format = 'MM/DD/YYYY, hh:mm A';
    const multiDate = true;
    let tdList = [(<td className='time-frame' key={1}>
      <p className='title-filter'>{'Select Time Frame'}</p>
      <Calendar options={{ format, multiDate }} onChange={this.handleChangeMultiCalendar.bind(this)} />
    </td>),
    (<td className='select-studio' key={2}>
      <p className='title-filter'>{'Select Studio'}</p>
      <FormStudioSelect actions={this.props.actions} />
    </td>),
    (<td className='select-fitness-equipment' key={3}>
      <p className='title-filter'>{'Fitness Equipment'}</p>
      <Select
        name='type'
        className='report-types'
        value={this.state.select.fitnessEquipment}
        options={AppConstants.fitnessEquipment}
        onChange={this.handleSelectChange('fitnessEquipment').bind(this)}
        inputProps={{ readOnly: true }} />
    </td>),
    (<td className='search-box' key={4}>
      <p className='title-filter' />
      <TableSearch
        className='col-md-4'
        actions={this.props.actions}
        searchFields={['username']}
        fullTextSearch={false} />
    </td>)
    ];
    return (
      <div className='panel-filter '>
        <table className='table-filter'>
          <tbody>
            <tr className='row-filter'>
              <td className='challenge-type'>
                <p className='title-filter'>{'Select Report'}</p>
                <Select
                  name='type'
                  className='report-types'
                  value={this.state.select.type}
                  options={AppConstants.reportTypes}
                  onChange={this.handleSelectChange('type').bind(this)}
                  inputProps={{ readOnly: true }} />
              </td>
              {this.state.select.type === 'Repeat_Usage' ? tdList : (<td className='time-frame'>
                <div>
                  <p className='title-filter'>{'Date'}</p>
                  <Calendar onChange={this.props.changeCalendar} />
                </div>
              </td>)}
              <td colSpan='3' />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

ReportFilter.propTypes = {
  actions: PropTypes.any,
  changeCalendar: PropTypes.any,
  handleFilter: PropTypes.func
};

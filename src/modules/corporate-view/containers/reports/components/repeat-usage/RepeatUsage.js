import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles.scss';
import { Table, TableColumn } from 'modules/core/components';

export class RepeatUsage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'corporate/reports'
    };
  }
  componentDidMount() {
    this.props.actions.core_table.search({
      url: this.state.url,
      params: {}
    });
  }

  formatViewMemberColumn() {
    return (
      <button className='view-btn'>{'VIEW'}</button>
    );
  }

  populateTableColumns() {
    return [
      new TableColumn({
        dataField: 'FullName',
        headerName: 'Name',
        isKey: true,
        dataSort: true
      }),
      new TableColumn({
        dataField: 'NumberOfTimes',
        headerName: 'Number of Times',
        dataSort: true
      }),
      new TableColumn({
        headerName: 'Dates of Entry',
        dataFormat: this.formatViewMemberColumn.bind(this),
        dataSort: false
      })
    ];
  }

  render() {
    return (
      <div className='repeat-usage'>
        <Table
          actions={this.props.actions}
          columns={this.populateTableColumns()}
          pagination={true} />
      </div>
    );
  }
}

RepeatUsage.propTypes = {
  actions: PropTypes.any
};

export default connect(state => ({
  members: state.corporate_members.members
}))(RepeatUsage);

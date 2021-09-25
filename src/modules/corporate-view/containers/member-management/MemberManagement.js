import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Table, TableColumn, TableSearch } from 'modules/core/components';

import './styles';

export class MemberManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'corporate/members',
      select: {
        type: 'FitnessBenchmark'
      }
    };
  }

  /**
   * This trigger is invoked immediately before mounting occurs.
   * Init default list members
   */
  componentWillMount() {
    this.props.actions.core_table.search({
      url: this.state.url,
      params: {}
    });
  }

  /**
   * Handle when click view button on member entry
   */
  viewMember() {
    // Do something
  }

  /**
   * Render view member column
   * @param {any} cell The cell value
   * @param {*} row The row object
   */
  formatViewMemberColumn(cell, row) {
    return (
      <button className='btn corporate-view-btn' onClick={this.viewMember.bind(this, row.id)}>{'View'}</button>
    );
  }

  /**
   * Render home studio column
   * @param {any} cell The cell value
   */
  formatHomeStudioColumn(cell) {
    return `<i class="fa fa-home" aria-hidden="true"></i> ${cell}`;
  }

  /**
   * Populate table columns for members management table
   */
  populateTableColumns() {
    return [
      new TableColumn({
        dataField: 'username',
        headerName: 'User Name',
        isKey: true
      }),
      new TableColumn({
        dataField: 'homeStudio',
        headerName: 'Home Studio',
        dataFormat: this.formatHomeStudioColumn
      }),
      new TableColumn({
        dataField: 'visitedStudio',
        headerName: 'Visited Studio'
      }),
      new TableColumn({
        headerName: 'View Member Detail',
        dataFormat: this.formatViewMemberColumn.bind(this),
        dataSort: false
      })
    ];
  }

  render() {
    return (
      <div className='corporate-member-management-wrapper'>
        <div className='row top'>
          <div className='col-md-12 title'>
            <h3>{'Member Management'}</h3>
          </div>
        </div>
        <div className='member-management-filter row'>
          <div className='col-md-8' />
          <div className='col-md-4'>
            <label>{'Member Search'}</label>
            <TableSearch
              actions={this.props.actions}
              searchFields={['username']}
              fullTextSearch={false} />
          </div>
        </div>
        <div className='member-management-table row'>
          <Table
            actions={this.props.actions}
            columns={this.populateTableColumns()}
            pagination={true} />
        </div>
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
MemberManagement.propTypes = {
  actions: PropTypes.any,
  members: PropTypes.array
};

export default connect(state => ({
  members: state.corporate_members.members,
  errors: state.corporate_members.errors
}))(MemberManagement);

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles.scss';
import Constants from 'common/constants/constants';
import { Table, TableColumn, TableSearch, ModalType } from 'modules/core/components';
import { EditPermissionsForm } from '..';

export class Permissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'corporate/permission'
    };
  }
  componentDidMount() {
    this.props.actions.core_table.search({
      url: this.state.url
    });
  }

  editMember() {
    this.props.actions.core_modal.show({
      title: 'EDIT PERMISSIONS',
      modalType: ModalType.Custom,
      size: 'lg',
      component: EditPermissionsForm,
      props: {
        actions: this.props.actions
      },
      headerClass: 'permissions-form-header',
      className: 'permissions-form-modal'
    });
  }

  formatLevel(cell) {
    if (cell.length === 1) {
      return (
        cell[0] === Object.keys(Constants.userRole)[0] ? <p><span className='dot-green'>{'● '}</span>{'Corporate Admin'}</p> : <p><span className='dot-orange'>{'● '}</span>{'Corporate User'}</p>
      );
    }
    return <p><span className='dot-green'>{'● '}</span>{'Corporate Admin'}</p>;
  }
  formatViewMemberColumn(cell, row) {
    return (
      <button className='btn corporate-view-btn' onClick={this.editMember.bind(this, row.id)}>{'Edit'}</button>
    );
  }
  populateTableColumns() {
    return [
      new TableColumn({
        dataField: 'FullName',
        headerName: 'User Name',
        isKey: true
      }),
      new TableColumn({
        dataField: 'Roles',
        headerName: 'Level',
        dataFormat: this.formatLevel.bind(this)
      }),
      new TableColumn({
        headerName: 'Edit Permissions Level',
        dataFormat: this.formatViewMemberColumn.bind(this),
        dataSort: false
      })
    ];
  }
  render() {
    return (
      <div>
        <div className='row top'>
          <div className='col-md-12 title'>
            <h3>{'Permission'}</h3>
          </div>
        </div>
        <div className='corporate-setting-permission'>
          <div className='member-management-filter row'>
            <div className='col-md-8' />
            <div className='col-md-4'>
              <label>{'User Search'}</label>
              <TableSearch
                actions={this.props.actions}
                searchFields={['FullName']}
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
      </div>
    );
  }
}
Permissions.propTypes = {
  actions: PropTypes.any,
  members: PropTypes.array
};
export default connect(state => ({
  members: state.corporate_members.members,
  errors: state.corporate_members.errors
}))(Permissions);

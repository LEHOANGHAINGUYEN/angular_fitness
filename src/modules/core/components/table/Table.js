/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { intlShape, injectIntl } from 'react-intl';

import './styles.scss';
import { AppConstants } from 'common';

/**
 * Using react bootstrap table for this customization
 * Reference to: http://allenfang.github.io/react-bootstrap-table/docs.html
 */
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 15
    };
  }
  /**
   * This trigger invoked immediately before a component is unmounted and destroyed
   * Call get destroy table data
   */
  componentWillUnmount() {
    this.props.actions.core_table.destroyData();
  }

  /**
   * Handle on sort change
   * @param {string} fieldName The field name of column that sorting
   * @param {string} ordering The ordering value (DESC, ASC)
   */
  onSortChange(fieldName, ordering) {
    let isEnableRemote = _.isUndefined(this.props.remote) ? true : this.props.remote;

    if (isEnableRemote) {
      this.props.actions.core_table.search({
        url: this.props.baseUrl,
        params: {
          sort: `${fieldName}_${ordering}`,
          pageIndex: 1,
          pageSize: this.props.pageSize
        }
      });
    }
  }

  /**
   * Handle on page change (Go to page, next page ...)
   * @param {number} nextPage The next page
   * @param {number} pageSize The page size
   */
  onPageChange(nextPage, pageSize) {
    let isEnableRemote = _.isUndefined(this.props.remote) ? true : this.props.remote;

    if (isEnableRemote) {
      this.props.actions.core_table.search({
        url: this.props.baseUrl,
        params: {
          sort: this.props.sort,
          pageIndex: nextPage,
          pageSize
        }
      });
    }
  }

  /**
   * Handle on size per page list is changed
   * @param {number} newPageSize
   */
  onSizePerPageList(newPageSize) {
    this.setState({ pageNumber: newPageSize });
    let isEnableRemote = _.isUndefined(this.props.remote) ? true : this.props.remote;

    if (isEnableRemote) {
      this.props.actions.core_table.search({
        url: this.props.baseUrl,
        params: {
          sort: this.props.sort,
          pageIndex: 1,
          pageSize: newPageSize
        }
      });
    }
  }

  remote(remoteObj) {
    let isEnable = _.isUndefined(this.props.remote) ? true : this.props.remote;
    // Only search, sort, pagination will be handled by remote store
    remoteObj.sort = isEnable;
    remoteObj.pagination = isEnable;
    remoteObj.search = isEnable;
    remoteObj.filter = isEnable;

    return remoteObj;
  }

  /**
   * Render table column based on given columns param
   */
  renderTableColumn() {
    const { isGlobal } = this.props;
    return (this.props.columns || []).map((column, index) => {
      return (
        <TableHeaderColumn
          key={index}
          columnClassName={column.className}
          isKey={column.isKey}
          dataAlign={column.dataAlign}
          headerAlign={column.headerAlign}
          dataField={column.dataField}
          dataSort={isGlobal ? false : column.dataSort}
          dataFormat={column.dataFormat}
          width={column.width}>
          {column.headerName}
        </TableHeaderColumn>
      );
    });
  }

  /**
   * Get default bootstrap table options
   * Reference http://allenfang.github.io/react-bootstrap-table/docs.html#options
   */
  populateTableDefaultOptions() {
    return {
      sortIndicator: false
    };
  }

  renderSizePerPageDropDown() {
    return (
      <span className='dropdown react-bs-table-sizePerPage-dropdown'>
        <button className='btn btn-default dropdown-toggle' id='pageDropDown' data-toggle='dropdown'>
          <span>
            {this.state.pageNumber}
            <span className='caret' />
          </span>
        </button>
        <ul className='dropdown-menu' role='menu' aria-labelledby='pageDropDown'>
          {
            AppConstants.listPageSizeNumber.map((n, idx) => {
              return (
                <li key={idx} role='presentation' onClick={() => this.onSizePerPageList(n)}>{n}</li>
              );
            })
          }
        </ul>
      </span>
    );
  }

  /**
   * Render loading indicator for table during waiting async request
   */
  renderLoadingIndicator() {
    return (
      <div className='sk-overlay'>
        <div className='sk-circle'>
          <div className='sk-circle1 sk-child' />
          <div className='sk-circle2 sk-child' />
          <div className='sk-circle3 sk-child' />
          <div className='sk-circle4 sk-child' />
          <div className='sk-circle5 sk-child' />
          <div className='sk-circle6 sk-child' />
          <div className='sk-circle7 sk-child' />
          <div className='sk-circle8 sk-child' />
          <div className='sk-circle9 sk-child' />
          <div className='sk-circle10 sk-child' />
          <div className='sk-circle11 sk-child' />
          <div className='sk-circle12 sk-child' />
        </div>
      </div>
    );
  }

  render() {
    const {intl, isGlobal, currentSt} = this.props;
    let options = {
      onSortChange: this.onSortChange.bind(this),
      page: this.props.pageIndex,
      ...this.populateTableDefaultOptions(),
      noDataText: intl.formatMessage({id: 'General.Table.NoData' })
    };

    if (this.props.pagination) {
      options = Object.assign({}, options, {
        sizePerPage: this.props.pageSize,
        sizePerPageDropDown: this.renderSizePerPageDropDown.bind(this),
        onPageChange: this.onPageChange.bind(this),
        onSizePerPageList: this.onSizePerPageList.bind(this)
      });
    }

    let className = 'table-wrapper';
    if (isGlobal) {
      className += ' table-global';
    }

    return (
      <div>
          <div className={className}>
            {!isGlobal ? this.props.isLoading && this.renderLoadingIndicator() : ''}
            <BootstrapTable
              isKey={true}
              tableHeaderClass={this.props.tableHeaderClass || ''}
              data={isGlobal ? currentSt : this.props.data}
              remote={this.remote.bind(this)}
              striped={this.props.striped || true}
              bordered={this.props.bordered || false}
              pagination={_.isUndefined(this.props.pagination) ? true : this.props.pagination}
              maxHeight={this.props.maxHeight || '450px'}
              hover={this.props.striped || true}
              fetchInfo={{ dataTotalSize: this.props.dataSize }}
              options={options}>
              {this.renderTableColumn()}
            </BootstrapTable>
          </div>
          {isGlobal && <div className='border-global' />}
        </div>
    );
  }
    }
    /**
     * Typechecking With PropTypes
     * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
     * Proptypes: https://github.com/facebook/prop-types
     */
Table.propTypes = {
  actions: PropTypes.any.isRequired, // The actions include common redux func (eg: show modal, etc)
  baseUrl: PropTypes.string, // Specify the end point of backend server
  bordered: PropTypes.bool, // Similar like Bootstrap table class: .table-bordered, default is false.
  challengeFilterComp: PropTypes.object,   // Specify the column
  columns: PropTypes.array.isRequired,   // The data that load into table
  currentSt: PropTypes.array,   // Specify the total size of data (server side)
  data: PropTypes.array, // Same as the Bootstrap table class: .table-hover, default is true.
  dataSize: PropTypes.number,
  hover: PropTypes.bool, // Use maxHeight to set the maximum height of table. You need give a string with an unit(px) value like,
  intl: intlShape.isRequired,   // Specify the current page number
  isGlobal: PropTypes.bool, // Page size for per page. Default is 10
  isLoading: PropTypes.bool, // Enable pagination by setting pagination to true, default is true.
  maxHeight: PropTypes.string, // Default handle data changing by backend service, if set to false table will handle in data store (client only)
  pageIndex: PropTypes.number, // Specify sort options.
  pageSize: PropTypes.number, // Same as the Bootstrap table class: .table-striped, default is true.
  pagination: PropTypes.bool, // Specify table header class name.
  paramFilter: PropTypes.object,
  remote: PropTypes.bool,
  sort: PropTypes.string,
  striped: PropTypes.bool,
  tableHeaderClass: PropTypes.string
};

const table = connect(state => ({
  baseUrl: state.core_table.baseUrl,
  data: state.core_table.data,
  currentSt: state.core_table.currentSt,
  dataSize: state.core_table.dataSize,
  isLoading: state.core_table.isLoading,
  pageIndex: state.core_table.pageIndex,
  pageSize: state.core_table.pageSize,
  sort: state.core_table.sort
}))(Table);

export default injectIntl(table);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormSelect, ModalType } from 'modules/core/components';
import './pagination.scss';
import TableSearch from './TableSearch';
import ShareSocial from '../../../studio-view/components/share-social/ShareSocial';
export class Pagination extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.config = this.props.config;
    this.configArea = this.props.configArea;
    this.state = {
      pageSize: this.config.pageSize,
      currentPage: this.config.pageDefault,
      frame: this.config.numberPageDisplay
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.sort && newProps.sort !== this.props.sort) {
      this.setState({
        currentPage: this.config.pageDefault
      });
    }
    if (newProps.division !== this.props.division) {
      this.setState({
        frame: this.config.numberPageDisplay
      });
    }
    if (newProps.pageIndex && newProps.pageIndex !== this.state.currentPage && !this.props.noReset) {
      this.setState(state => {
        return {
          ...state,
          currentPage: newProps.pageIndex
        };
      });
    }
  }
  resetState() {
    this.setState({
      currentPage: this.config.pageDefault,
      frame: this.config.numberPageDisplay
    });
  }

  handleChange(e) {
    let changeValue = parseInt(e.value, 10);
    this.setState({
      pageSize: changeValue,
      currentPage: this.config.pageDefault,
      frame: this.config.numberPageDisplay
    });
    this.props.onPageChange(this.config.pageDefault, changeValue);
  }

  handleClick(e, isDisable) {
    if (isDisable) {
      return;
    }
    let selected;
    if (e.target.parentElement.dataset.value) {
      selected = parseInt(e.target.parentElement.dataset.value, 10);
    } else {
      selected = parseInt(e.target.dataset.value, 10);
    }
    let selectedPage = parseInt(this.state.currentPage, 10);
    let frame = this.config.numberPageDisplay;
    let frameState = this.state.frame;
    if (this.state.currentPage === 1 && this.props.sort) {
      frameState = this.config.numberPageDisplay;
    }
    switch (selected) {
      case 0:
        selectedPage--;
        if (selectedPage === this.state.frame - frame) {
          frameState--;
        }
        break;
      case -1:
        selectedPage++;
        if (selectedPage === this.state.frame + 1) {
          frameState++;
        }
        break;
      default:
        selectedPage = selected;
        break;
    }
    this.setState({
      currentPage: selectedPage,
      frame: frameState
    });
    this.props.onPageChange(selectedPage, this.state.pageSize);
  }

  shareSocical() {
    const { actions } = this.props;
    actions.core_table.search({
      url: this.props.baseUrl,
      params: {
        sort: this.props.sort,
        pageIndex: 1,
        pageSize: this.props.totalItem
      }
    });
    actions.core_modal.show({
      modalType: ModalType.Custom,
      size: 'lg',
      component: ShareSocial,
      props: {
        actions: this.props.actions
      },
      className: 'share-social-container',
      headerClass: 'share-social-header'
    });
  }

  render() {
    const { isGlobal, isChallengeList } = this.props;
    let lis = [];
    const sizeCollumn = isChallengeList ? 'col-md-10' : 'col-md-5';
    const isPagination = this.config.pageSize > 5 ? sizeCollumn : 'col-md-12';
    const isPageItem =
      this.config.pageSize > 5 ? 'page-item' : 'page-item-history';
    let pageSize = this.state.pageSize;
    let totalItem = parseInt(this.props.totalItem, 10);

    let totalPage = Math.floor(totalItem / pageSize);
    if (totalItem % pageSize > 0) {
      totalPage++;
    }
    let currentPage = this.state.currentPage;
    let frame = this.config.numberPageDisplay;
    if (totalPage > 0) {
      lis.push(
        <li
          key='previous'
          className={`${isPageItem} ${
            currentPage === 1 ? 'disabled' : 'enabled'
            }`}>
          <a
            data-value={0}
            onClick={e => this.handleClick(e, currentPage === 1)}
            className='page-link'>
            <i className='fa fa-angle-left' />
          </a>
        </li>
      );
    }
    if (this.state.frame <= totalPage) {
      let end = this.state.frame;
      let start = this.state.frame - frame + 1;
      if ((this.state.currentPage === 1 && this.props.sort)) {
        start = this.config.pageDefault;
        end = this.config.numberPageDisplay;
      }
      for (let i = start; i <= end; i++) {
        let active = i === currentPage ? ' active' : '';
        lis.push(
          <li key={i} className={`${isPageItem}${active}`}>
            <a
              data-value={i}
              className='page-link'
              onClick={e => this.handleClick(e)}>
              {i}
            </a>
          </li>
        );
      }
    } else {
      for (let i = 1; i <= totalPage; i++) {
        let active = i === currentPage ? ' active' : '';
        lis.push(
          <li key={i} className={`${isPageItem}${active}`}>
            <a
              data-value={i}
              className='page-link'
              onClick={e => this.handleClick(e)}>
              {i}
            </a>
          </li>
        );
      }
    }

    if (totalPage > 0) {
      lis.push(
        <li
          key='next'
          className={`${isPageItem} ${
            currentPage === totalPage ? 'disabled' : 'enabled'
            }`}>
          <a
            data-value={-1}
            onClick={e => this.handleClick(e, currentPage === totalPage)}
            className='page-link'>
            <i className='fa fa-angle-right' />
          </a>
        </li>
      );
    }

    return (
      <div className={`row customize-pagination ${isChallengeList ? 'pagination-list-challenge' : ''}`}>
        <div className={isGlobal ? 'col-md-3' : isPagination}>
          <ul className='pagination number-wrapper'>{lis}</ul>
        </div>
        {this.config.pageSize > 5 && (
          <div>
            {this.props.enableSearch && (
              <div className={`${isGlobal ? 'global-page' : ''} col-md-6 search-content ${isChallengeList ? 'search-challenge-list' : ''}`}>
                <TableSearch
                  enableCollapse={true}
                  {...this.props}
                  fullTextSearch={false}
                  isGlobal={isGlobal} />
              </div>
            )}

            {this.config.pageSize > 5 && !this.props.enableSearch && (
              <div>
                <div className='col-md-6 share-social'>
                  <li className='custom-social'>
                    <i className='fas fa-share-alt' onClick={this.shareSocical.bind(this)} />
                  </li>
                </div>
              </div>
            )}
            <div className={`col-md-1 page-size-dropdown ${isChallengeList ? 'customize-dropdown-challenge' : ''}`}>
              {this.config.pageSize !== 5 && (
                <FormSelect
                  async={false}
                  className='custom-pagination-page-size'
                  searchable={false}
                  options={this.config.pageSizes}
                  value={this.state.pageSize}
                  onChange={this.handleChange} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

Pagination.propTypes = {
  actions: PropTypes.any,
  baseUrl: PropTypes.string,
  config: PropTypes.object,
  configArea: PropTypes.any,
  division: PropTypes.string,
  enableSearch: PropTypes.bool,
  isChallengeList: PropTypes.bool,
  isGlobal: PropTypes.bool,
  noReset: PropTypes.bool,
  onPageChange: PropTypes.func,
  pageIndex: PropTypes.number,
  sort: PropTypes.string,
  totalItem: PropTypes.any
};

const pagination = connect(state => ({
  sort: state.core_table.sort,
  pageIndex: state.core_table.pageIndex,
  baseUrl: state.core_table.baseUrl,
  division: state.core_table.division
}))(Pagination);

export default pagination;

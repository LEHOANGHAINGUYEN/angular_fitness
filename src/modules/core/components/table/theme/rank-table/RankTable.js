/**
 * React / Redux dependencies
 */
import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape, injectIntl } from 'react-intl';

import Table from '../../Table';

import './styles.scss';
import { Helpers } from 'common';
import { IconMale, IconFemale, Logo } from 'modules/shared/images';

import Pagination from '../../Pagination';
import Constants from 'common/constants/constants';

/**
 * Using react bootstrap table for this customization
 * Reference to: http://allenfang.github.io/react-bootstrap-table/docs.html
 */
class RankTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.props.columns,
      sizing: window.screen.availWidth,
      column: this.props.column
    };
  }

  componentWillMount() {
    if (this.props.isGlobal) {
      this.customizeColumns(this.state.column);
    }
    this.customizeColumns(this.state.columns);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.columns && newProps.columns !== this.props.columns) {
      this.customizeColumns(newProps.columns);
    }
  }

  /**
   * Render rank column
   * @param {any} cell The cell value
   */
  formatRankColumn(cell) {
    const { locale, intl } = this.props;
    let bgClass = [1, 2, 3].indexOf(cell) !== -1 ? `rank-${cell}` : 'rank-other';
    let sup;
    if (cell) {
      sup = locale === 'en' ? intl.formatMessage({ id: Helpers.getOrdinalSuffix(cell) }) : '';
    }
    return (
      <div className={bgClass}>
        <div className='col-md-12'>
          <p className='rank-number'>
            {cell}
            <sup className='rank-sub'>{sup}</sup>
          </p>
        </div>
      </div>
    );
  }

  /**
   * Render member column
   * @param {any} cell The cell value
   */
  formatMemberColumn(cell, row) {
    let memberName = Helpers.formatMemberName(row.FirstName, row.LastName);
    let img;
    let gender = row.GenderId;

    if (gender === 2) {
      img = IconFemale;
    } else if (gender === 1) {
      img = IconMale;
    } else if (row.ChallengeId) {
      img = row.LogoUrl;
    } else {
      img = Logo;
    }

    return (
      <div className='info-wrapper'>
        <img src={img} className='member-avatar' />
        <span className='member-name'>{memberName}</span>
      </div>
    );
  }

  formStudioColumn(cell, row) {
    return (
      <div className='info-wrapper'>
        <span className='member-name'>{row.studioName}</span>
      </div>
    );
  }
  formStudioAverage(cell, row) {
    return <span>{row.myProperty}</span>;
  }
  /**
   * Format column for overall leader board table
   * @param {any} cell The cell value
   * @param {object} row The row object value
   */
  formatColumn(cell, row) {
    if ([1, 2, 3].indexOf(row.rank) !== -1) {
      return (
        <p className='text-time'>
          <span className='time'>{cell}</span>
        </p>
      );
    }
    return (
      <p className='text-time'>
        <span className='time'>{cell}</span>
      </p>
    );
  }
  formatChallengeNameColumn(cell, row) {
    const { challengeTemplate } = this.props;
    let challengeTitle = Helpers.getTitleChallenge(row.ChallengeTemplateId, challengeTemplate) || 'No Today Challenge';
    return <span className='customize-challenge-name'>{challengeTitle}</span>;
  }
  customizeColumns(columns) {
    const { isChallengeList, isGlobal } = this.props;
    columns[0].dataFormat = isChallengeList ? this.formatChallengeNameColumn.bind(this)
      : this.formatRankColumn.bind(this);
    columns[0].width = isChallengeList ? '230px' : '130px';
    columns[0].className = 'top-rank';
    columns[1].dataFormat = isGlobal ? this.formStudioColumn : this.formatMemberColumn;
    columns[1].className = 'member-column';
    columns[1].width = isChallengeList ? '13%' : '22%';

    this.setState({ columns });
  }

  onSearch(pageIndex, pageSize) {
    let isEnableRemote = this.props.remote || true;
    if (isEnableRemote) {
      this.props.actions.core_table.search({
        url: this.props.baseUrl,
        params: {
          sort: this.props.sort,
          pageIndex,
          pageSize
        }
      });
    }
  }

  render() {
    const { isGlobal, challengeFilterComp } = this.props;
    return (
      <div className='customized-table'>
        <div className='custom-pagination'>
          <Pagination
            config={Constants.pagination.default}
            configArea={Constants.paginationArea.default}
            isGlobal={isGlobal}
            totalItem={this.props.dataSize}
            onPageChange={this.onSearch.bind(this)}
            {...this.props}
            enableSearch={this.props.enableSearch || false} />
        </div>
        {isGlobal && (
          <Table
            actions={this.props.actions}
            columns={this.state.column}
            pagination={false}
            isGlobal={isGlobal} />
        )}
        {isGlobal ? (
          <div className='table-wp'>
            <Table
              actions={this.props.actions}
              columns={this.state.columns}
              pagination={false} />
          </div>
        ) : (
            <Table
              actions={this.props.actions}
              columns={this.state.columns}
              pagination={false} challengeFilterComp={challengeFilterComp} />
          )}
      </div>
    );
  }
}

RankTable.propTypes = {
  actions: Proptypes.object,
  baseUrl: Proptypes.string,
  challengeFilterComp: Proptypes.func,
  challengeTemplate: Proptypes.object,
  column: Proptypes.any,
  columns: Proptypes.any,
  dataSize: Proptypes.number,
  enableSearch: Proptypes.bool,
  intl: intlShape.isRequired,
  isChallengeList: Proptypes.bool,
  isGlobal: Proptypes.bool,
  itemChallenge: Proptypes.object,
  locale: Proptypes.any,
  remote: Proptypes.bool,
  sort: Proptypes.string
};

const rankTable = connect(state => ({
  dataSize: state.core_table.dataSize,
  baseUrl: state.core_table.baseUrl,
  sort: state.core_table.sort,
  locale: state.core_language.locale,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  deleteChallengeTemplateSuccess: state.shared_challenges.deleteChallengeTemplateSuccess
}))(RankTable);

export default injectIntl(rankTable);

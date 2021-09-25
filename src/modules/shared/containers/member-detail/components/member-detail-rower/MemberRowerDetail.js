import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as _ from 'lodash';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import Constants from 'common/constants/constants';
import { Pagination } from 'modules/core/components/table/Pagination';
import {
  MemberTotalBenchmarksTable,
  ListPerformanceHistory
} from '../../components';
import './styles.scss';
import helpers from 'common/utils/helpers';

export class MemberRowerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false
    };
  }

  componentDidMount() {
    const { actions, memberDetail, pageSize, pageIndex } = this.props;
    if (memberDetail) {
      actions.shared_members.getMemberBenchmarks({
        memberId: memberDetail.MemberId,
        equipmentId: Constants.EquipmentType.Row,
        isOriginal: true,
        pageIndex,
        pageSize
      });
    }
  }

  populateMetricRecords(metricRecords) {
    const {uom} = this.props;
    let data = metricRecords || [];
    return data.map(metric => {
      const entryType = (metric.MetricEntry || {}).EntryType;
      const equipmentId = (metric.MetricEntry || {}).EquipmentId;
      const unit = helpers.renderUOM(uom, entryType, equipmentId);
      return {
        name: (metric.MetricEntry || {}).Title,
        records: [
          `${metric.LastRecord} ${unit}`,
          `${metric.PreviousRecord} ${unit}`,
          `${metric.BestRecord} ${unit}`,
          metric.ChallengeType]
      };
    });
  }

  /**
   * Populate / standardize list of performance history
   * @param {object} benchmarkHistories The performance history list
   */
  populateListPerformanceHistory(benchmarkHistories) {
    let data = benchmarkHistories || [];
    let dataSort = data.map(item => {
      return {
        date: item.DateUpdated,
        metricEntry: item.MetricEntry,
        classTime: moment(item.ClassTime),
        time: item.Result,
        type: (item.MetricEntry || {}).Title,
        metricEntryType: (item.MetricEntry || {}).MetricKey,
        studio: item.StudioName,
        studioNumber: item.StudioNumber,
        equipmentId: (item.MetricEntry || {}).EquipmentId,
        entryType: (item.MetricEntry || {}).EntryType,
        challengeTemplateId: item.ChallengeTemplateId,
        challengeTemplateTypeId: item.ChallengeTemplateTypeId
      };
    });
    return _.orderBy(dataSort, ['classTime'], 'desc');
  }

  renderPerformanceHistory() {
    const { personalBenchmarksData, intl, uom, equipmentType } = this.props;
    return (
      <ListPerformanceHistory
        title={intl.formatMessage({ id: 'PersonalBenchmarks.History.Title' })}
        hiddenColumnIndex={[1]}
        metricRecords={(personalBenchmarksData || {}).MetricRecords}
        list={this.populateListPerformanceHistory(
          (personalBenchmarksData || {}).BenchmarkHistories
        )}
        equipmentType={equipmentType}
        uom={uom} />
    );
  }
  onSearch(pageIndex, pageSize) {
    const { actions, memberDetail } = this.props;
    if (memberDetail) {
      actions.shared_members.getMemberBenchmarks({
        memberId: memberDetail.MemberId,
        equipmentId: Constants.EquipmentType.Row,
        isOriginal: true,
        pageIndex,
        pageSize
      });
    }
  }
  render() {
    const { personalBenchmarksData } = this.props;
    const totalBenchmarkHistories = (personalBenchmarksData || {}).TotalBenchmarkHistoryRecord;
    return (
      <div>
        <MemberTotalBenchmarksTable
          list={this.populateMetricRecords(
            (personalBenchmarksData || {}).MetricRecords
          )}
          isMulti='false'
          memberDetail={this.props.memberDetail} />
        <div className='background-member-status'>
          <div className='row header-performance-history'>
            <span className='col-md-9'><FormattedMessage id={'PersonalBenchmarks.History.Title'} /></span>
            <Pagination
              config={Constants.pagination.defaultMember}
              onPageChange={this.onSearch.bind(this)}
              {...this.props}
              totalItem={totalBenchmarkHistories}
              noReset={true}/>
          </div>
          {this.renderPerformanceHistory()}
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
MemberRowerDetail.propTypes = {
  actions: PropTypes.object,
  equipmentType: PropTypes.object,
  intl: intlShape.isRequired,
  memberDetail: PropTypes.object,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  personalBenchmarksData: PropTypes.object,
  uom: PropTypes.object
};

const memberRowerDetail = connect(state => ({
  personalBenchmarksData: state.shared_members.personalBenchmarksData,
  pageSize: state.shared_members.pageSize,
  pageIndex: state.shared_members.pageIndex
}))(MemberRowerDetail);

export default injectIntl(memberRowerDetail);

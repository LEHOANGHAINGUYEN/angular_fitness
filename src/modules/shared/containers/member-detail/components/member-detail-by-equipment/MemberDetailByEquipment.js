import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as _ from 'lodash';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import Constants from 'common/constants/constants';
import {
  MemberTotalBenchmarksTable,
  ListPerformanceHistory
} from '../../components';
import { Pagination } from 'modules/core/components/table/Pagination';
import './styles.scss';

export class MemberDetailByEquipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false
    };
    this.distanceCoefficient = Constants.CoefficientUnitMeasurement.Distance;
  }

  componentDidMount() {
    const {
      actions,
      memberDetail,
      equipmentType,
      pageIndex,
      pageSize
    } = this.props;

    if (memberDetail) {
      actions.shared_members.getMemberBenchmarks({
        memberId: memberDetail.MemberId,
        equipmentId: equipmentType,
        isOriginal: true,
        pageIndex,
        pageSize
      });
    }
  }

  componentWillUpdate(nextProps) {
    const {
      actions,
      equipmentType,
      memberDetail,
      pageIndex,
      pageSize
    } = this.props;

    if (memberDetail && equipmentType !== nextProps.equipmentType) {
      actions.shared_members.getMemberBenchmarks({
        memberId: memberDetail.MemberId,
        equipmentId: nextProps.equipmentType,
        isOriginal: true,
        pageIndex,
        pageSize
      });
    }
  }

  formatDistanceData(data, coefficient) {
    return (parseFloat(data) / coefficient).toFixed(3).split('.')[0].length < 2 ? `0${(parseFloat(data) / coefficient).toFixed(3)}` : (parseFloat(data) / coefficient).toFixed(3);
  }
  convertDistanceData(input) {
    let cloneInput = _.cloneDeep(input);
    let record = cloneInput.data;
    if (cloneInput.isPerformanceHistory) {
      record.Result = this.formatDistanceData(record.Result, cloneInput.isImperial ? this.distanceCoefficient : 1);
    } else {
      record.LastRecord = this.formatDistanceData(record.LastRecord, cloneInput.isImperial
        ? this.distanceCoefficient : 1);
      record.PreviousRecord = this.formatDistanceData(record.PreviousRecord, cloneInput.isImperial
        ? this.distanceCoefficient : 1);
      record.BestRecord = this.formatDistanceData(record.BestRecord, cloneInput.isImperial
         ? this.distanceCoefficient : 1);
    }
    return record;
  }

  populateMetricRecords(metricRecords, uom) {
    const { equipmentType } = this.props;
    let data = metricRecords || [];
    return data.map((metric) => {
      let unitName = '';

      switch ((metric.MetricEntry || {}).EntryType) {
        case Constants.MetricEntryType.Distance:
          metric = this.convertDistanceData({
            data: metric,
            isImperial: uom[equipmentType] === Constants.UnitMeasurementType.Imperial
          });
          unitName = uom[equipmentType] === Constants.UnitMeasurementType.Imperial ? 'mile' : 'kilometer';
          break;
        case Constants.MetricEntryType.Time:
          unitName = 'min';
          break;
        default:
          unitName = 'mile';
          break;
      }

      return {
        name: (metric.MetricEntry || {}).Title,
        records: [
          `${metric.LastRecord} ${unitName}`,
          `${metric.PreviousRecord} ${unitName}`,
          `${metric.BestRecord} ${unitName}`,
          `${metric.ChallengeType}`
        ]
      };
    });
  }

  /**
   * Populate / standardize list of performance history
   * @param {object} benchmarkHistories The performance history list
   */
  populateListPerformanceHistory(benchmarkHistories, uom) {
    const { equipmentType } = this.props;

    let data = benchmarkHistories || [];
    let dataSort = data.map((item) => {
      if ((item.MetricEntry || {}).EntryType === Constants.MetricEntryType.Distance) {
        item = this.convertDistanceData({
          data: _.cloneDeep(item),
          isImperial: uom[equipmentType] === Constants.UnitMeasurementType.Imperial,
          isPerformanceHistory: true
        });
      }
      return {
        date: item.DateUpdated,
        classTime: moment(item.ClassTime),
        time: item.Result,
        type: (item.MetricEntry || {}).Title,
        metricEntryType: (item.MetricEntry || {}).MetricKey,
        studio: item.StudioName,
        equipmentId: (item.MetricEntry || {}).EquipmentId,
        entryType: (item.MetricEntry || {}).EntryType,
        studioNumber: item.StudioNumber,
        challengeTemplateId: item.ChallengeTemplateId,
        challengeTemplateTypeId: item.ChallengeTemplateTypeId
      };
    });
    return _.orderBy(dataSort, ['classTime'], 'desc');
  }
  renderPerformanceHistory(uom) {
    // Render performance history by list view
    const { personalBenchmarksData, equipmentType } = this.props;
    // Group performance history data by metric type
    let benchmarkHistories = (personalBenchmarksData || {}).BenchmarkHistories || [];
    // For each metric key we'll render metric record one by one
    return <ListPerformanceHistory
      hiddenColumnIndex={[1]}
      metricRecords={(personalBenchmarksData || {}).MetricRecords}
      list={this.populateListPerformanceHistory(benchmarkHistories, uom)}
      equipmentType={equipmentType}
      uom={uom} />;
  }

  onSearch(pageIndex, pageSize) {
    const { actions, memberDetail, equipmentType } = this.props;
    if (memberDetail) {
      actions.shared_members.getMemberBenchmarks({
        memberId: memberDetail.MemberId,
        equipmentId: equipmentType,
        isOriginal: true,
        pageIndex,
        pageSize
      });
    }
  }

  render() {
    const { personalBenchmarksData, uom } = this.props;
    const total = (personalBenchmarksData || {}).TotalBenchmarkHistoryRecord;

    return (
      <div>
        <MemberTotalBenchmarksTable
          list={this.populateMetricRecords(
            (personalBenchmarksData || {}).MetricRecords, uom
          )}
          isMulti='true'
          memberDetail={this.props.memberDetail} />
        <div className='background-member-status'>
          <div className='row header-performance-history'>
            <span className='col-md-9'><FormattedMessage id={'PersonalBenchmarks.History.Title'} /></span>
            <Pagination
              config={Constants.pagination.defaultMember}
              noReset={true}
              onPageChange={this.onSearch.bind(this)}
              {...this.props}
              totalItem={total} />
          </div>
          {this.renderPerformanceHistory(uom)}
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
MemberDetailByEquipment.propTypes = {
  actions: PropTypes.object,
  equipmentName: PropTypes.string,
  equipmentType: PropTypes.number,
  intl: intlShape.isRequired,
  memberDetail: PropTypes.object,
  originData: PropTypes.object,
  pageIndex: PropTypes.any,
  pageSize: PropTypes.any,
  personalBenchmarksData: PropTypes.object,
  uom: PropTypes.object
};

const memberDetailByEquipment = connect(state => ({
  personalBenchmarksData: state.shared_members.personalBenchmarksData,
  pageSize: state.shared_members.pageSize,
  pageIndex: state.shared_members.pageIndex
}))(MemberDetailByEquipment);

export default injectIntl(memberDetailByEquipment);

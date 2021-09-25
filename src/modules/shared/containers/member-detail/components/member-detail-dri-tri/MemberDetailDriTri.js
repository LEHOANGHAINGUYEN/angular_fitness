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
import helpers from 'common/utils/helpers';

import './styles.scss';

export class MemberDetailDriTri extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      typeDriTri: 'dritri'
    };
  }

  componentDidMount() {
    const { actions, memberDetail, pageIndex, pageSize, challengeTemplate } = this.props;
    if (memberDetail) {
      actions.shared_members.getMemberBenchmarks({
        memberId: memberDetail.MemberId,
        challengeTypeId: challengeTemplate.DriTri.ChallengeTemplateId,
        pageIndex, pageSize,
        isOriginal: true
      });
    }
  }

  populateMetricRecords(metricRecords) {
    const { intl, uom } = this.props;
    let data = metricRecords || [];

    return data.map(metric => {
      const entryType = (metric.MetricEntry || {}).EntryType;
      const equipmentId = (metric.MetricEntry || {}).EquipmentId;
      const unit = helpers.renderUOM(uom, entryType, equipmentId);
      return {
        name: intl.formatMessage({
          id: 'PersonalBenchmarks.MetricRecords.Time'
        }),
        records: [
          `${metric.LastRecord} ${unit}`,
          `${metric.PreviousRecord} ${unit}`,
          `${metric.BestRecord} ${unit}`,
          metric.EquipmentName]
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
        classTime: moment(item.ClassTime),
        metricEntry: item.MetricEntry,
        time: item.Result,
        metricEntryType: (item.MetricEntry || {}).MetricKey,
        studio: item.StudioName,
        studioNumber: item.StudioNumber,
        challengeTemplateId: item.ChallengeTemplateId,
        equipmentType: item.EquipmentName,
        equipmentId: (item.MetricEntry || {}).EquipmentId,
        entryType: (item.MetricEntry || {}).EntryType
      };
    });
    return _.orderBy(dataSort, ['classTime'], 'desc');
  }

  renderPerformanceHistory() {
    const { personalBenchmarksData, uom } = this.props;
    return (
      <ListPerformanceHistory
        hiddenColumnIndex={[3, 4]}
        metricRecords={(personalBenchmarksData || {}).MetricRecords}
        list={this.populateListPerformanceHistory(
          (personalBenchmarksData || {}).BenchmarkHistories
        )}
        uom={uom}
        isDritri={true} />
    );
  }

  selectType(name) {
    this.setState({
      typeDriTri: name,
      isChart: false
    }, () => {
      let { memberDetail, actions, pageIndex, pageSize, challengeTemplate } = this.props;
      if (memberDetail) {
        let reqOpts = {};
        switch (this.state.typeDriTri) {
          case 'dritri': {
            reqOpts = {
              memberId: memberDetail.MemberId,
              challengeTypeId: challengeTemplate.DriTri.ChallengeTemplateId,
              pageIndex, pageSize,
              isOriginal: true
            };
            break;
          }
          case 'sprint-dritri': {
            reqOpts = {
              memberId: memberDetail.MemberId,
              challengeTypeId: challengeTemplate.DriTri.ChallengeTemplateId,
              challengeSubTypeId: challengeTemplate.DriTri.ChallengeTemplateTypes[0].ChallengeTemplateTypeId,
              pageIndex, pageSize
            };
            break;
          }
          case 'relay-dritri': {
            reqOpts = {
              memberId: memberDetail.MemberId,
              challengeTypeId: challengeTemplate.DriTri.ChallengeTemplateId,
              challengeSubTypeId: challengeTemplate.DriTri.ChallengeTemplateTypes[1].ChallengeTemplateTypeId,
              pageIndex, pageSize
            };
            break;
          }
          default: {
            reqOpts = {
              memberId: memberDetail.MemberId,
              challengeTypeId: challengeTemplate.DriTri.ChallengeTemplateId,
              challengeSubTypeId: challengeTemplate.DriTri.ChallengeTemplateTypes[0].ChallengeTemplateTypeId,
              pageIndex, pageSize
            };
            break;
          }
        }
        actions.shared_members.getMemberBenchmarks(reqOpts);
      }
    });
  }
  onSearch(pageIndex, pageSize) {
    const { actions, memberDetail, personalBenchmarksData } = this.props;
    if (memberDetail) {
      if (personalBenchmarksData.BenchmarkHistories[0].ChallengeTemplateTypeId) {
        actions.shared_members.getMemberBenchmarks({
          memberId: memberDetail.MemberId,
          challengeTypeId: personalBenchmarksData.BenchmarkHistories[0].ChallengeTemplateId,
          challengeSubTypeId: personalBenchmarksData.BenchmarkHistories[0].ChallengeTemplateTypeId,
          pageIndex, pageSize
        });
      } else {
        actions.shared_members.getMemberBenchmarks({
          memberId: memberDetail.MemberId,
          challengeTypeId: personalBenchmarksData.BenchmarkHistories[0].ChallengeTemplateId,
          isOriginal: true,
          pageIndex, pageSize
        });
      }
    }
  }

  render() {
    const { personalBenchmarksData } = this.props;
    const { typeDriTri } = this.state;
    const total = (personalBenchmarksData || {}).TotalBenchmarkHistoryRecord;
    return (
      <div>
        <div className='container-toggle'>
          <div className='toggle-wrapper orange'>
            {typeDriTri === 'dritri' && <div className='triangle' />}
            <p
              className={`title-toggle${
                typeDriTri === 'dritri' ? ' selected' : ''
                }`}
              onClick={() => this.selectType.bind(this)('dritri')}>
              {'DRI-TRI'}
            </p>
          </div>
          <div className='toggle-wrapper orange'>
            {typeDriTri === 'sprint-dritri' && <div className='triangle' />}
            <p
              className={`title-toggle${
                typeDriTri === 'sprint-dritri' ? ' selected' : ''
                }`}
              onClick={() => this.selectType.bind(this)('sprint-dritri')}>
              {'DRI-TRI SPRINT'}
            </p>
          </div>
          <div className='toggle-wrapper orange'>
            {typeDriTri === 'relay-dritri' && <div className='triangle' />}
            <p
              className={`title-toggle${
                typeDriTri === 'relay-dritri' ? ' selected' : ''
                }`}
              onClick={() => this.selectType.bind(this)('relay-dritri')}>
              {'DRI-TRI RELAY'}
            </p>
          </div>
        </div>
        <MemberTotalBenchmarksTable
          list={this.populateMetricRecords(
            (personalBenchmarksData || {}).MetricRecords
          )}
          isMulti='false'
          headerKey={'PersonalBenchmarks.MetricRecords.DriTri'}
          memberDetail={this.props.memberDetail} />
        <div className='background-member-status'>
          <div className='row header-performance-history'>
            <span className='col-md-9'><FormattedMessage id={'PersonalBenchmarks.History.Title'} /></span>
            <Pagination
              config={Constants.pagination.defaultMember}
              onPageChange={this.onSearch.bind(this)} {...this.props}
              totalItem={total}
              noReset={true} />
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
MemberDetailDriTri.propTypes = {
  actions: PropTypes.object,
  challengeTemplate: PropTypes.object,
  intl: intlShape.isRequired,
  memberDetail: PropTypes.object,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  personalBenchmarksData: PropTypes.object,
  uom: PropTypes.object
};

const memberDetailDriTri = connect(state => ({
  challengeTemplate: state.shared_challenges.challengeTemplate,
  personalBenchmarksData: state.shared_members.personalBenchmarksData,
  pageSize: state.shared_members.pageSize,
  pageIndex: state.shared_members.pageIndex
}))(MemberDetailDriTri);

export default injectIntl(memberDetailDriTri);

import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { DateTimeRectangle, DateTimeRectangleType } from 'modules/core/components';

import './styles.scss';
import { Helpers } from 'common';


export class ListPerformanceHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Indicate whether this record with metric entry type is the best record
   * @param {string} record Specific the record
   * @param {string} metricEntryType Specific the metric entry typee
   */
  isBestRecord(record, metricEntryType, equipmentId) {
    const { metricRecords, isDritri } = this.props;
    let metricEntry;
    if (isDritri) {
      metricEntry = (metricRecords || []).find(item => {
        return (item.MetricEntry || {}).MetricKey === metricEntryType && item.EquipmentId === equipmentId;
      });
    } else {
      metricEntry = (metricRecords || []).find(item => {
        return (item.MetricEntry || {}).MetricKey === metricEntryType;
      });
    }
    if (!metricEntry) { return false; }

    return record === metricEntry.BestRecord;
  }

  renderHeader() {
    const { hiddenColumnIndex } = this.props;
    let ths = [
      <th key='l_history_th_1'><FormattedMessage id={'PersonalBenchmarks.PerformanceHistory.Date'} /></th>,
      <th key='l_history_th_2'><FormattedMessage id={'PersonalBenchmarks.PerformanceHistory.EquipmentType'} /></th>,
      <th key='l_history_th_3'><FormattedMessage id={'PersonalBenchmarks.PerformanceHistory.Studio'} /></th>,
      <th key='l_history_th_4'><FormattedMessage id={'PersonalBenchmarks.PerformanceHistory.Challenge'} /></th>,
      <th key='l_history_th_5'><FormattedMessage id={'PersonalBenchmarks.PerformanceHistory.ClassSize'} /></th>,
      <th key='l_history_th_6'><FormattedMessage id={'PersonalBenchmarks.PerformanceHistory.Record'} /></th>
    ];

    if (hiddenColumnIndex) {
      ths = _.filter(ths, (th, index) => {
        return !hiddenColumnIndex.includes(index);
      });
    }

    return <tr>
      {ths}
    </tr>;
  }

  renderBody() {
    const { list, challengeTemplate, uom, equipmentType } = this.props;
    return list.map((item, i) => (
      <tr key={i}>
        <td>
          <DateTimeRectangle type={DateTimeRectangleType.Year}
            value={item.classTime}
            title={moment(item.classTime).format('ddd')} />
        </td>
        {item.challengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId
          && (<td>{item.equipmentType}</td>)}
        <td>{`${item.studio} #${item.studioNumber}`}</td>
        {item.challengeTemplateId !== challengeTemplate.DriTri.ChallengeTemplateId
          && (<td>{this.renderChallengeName(item)}</td>)}
        {item.challengeTemplateId !== challengeTemplate.DriTri.ChallengeTemplateId
          && (<td>{this.renderChallengeClassSize(item)}</td>)}
        <td>
          {
            this.isBestRecord(item.time, item.metricEntryType, item.equipmentId) ?
              (<i className='fa fa-star orange-star' />) :
              (<span className='no-star'>&nbsp;</span>)
          }
          {`${item.time} ${Helpers.renderUOM(uom, item.entryType, equipmentType)}`}
        </td>
      </tr>
    ));
  }

  /**
   * Render challenge class size (Orignal or 3G)
   * @param {Object} challenge
   */
  renderChallengeClassSize(challenge) {
    const { challengeTemplate } = this.props;
    const ctt = Helpers.getChallengeTemplateTypeById(
      challenge.challengeTemplateId, challenge.challengeTemplateTypeId, challengeTemplate
    );
    const ct = Helpers.getChallengeTemplateById(challenge.challengeTemplateId, challengeTemplate);
    let classSize = '';
    if (ctt) {
      classSize = challenge.challengeTemplateId !== challengeTemplate.MarathonMonth.ChallengeTemplateId
        ? Helpers.findDiffString(ct.TemplateName, ctt.TemplateTypeName).trim().toUpperCase()
        : '';
    }
    return classSize;
  }

  renderChallengeName(challenge) {
    const { challengeTemplate } = this.props;
    const { challengeTemplateId, type } = challenge;
    return challengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId
      ? type : Helpers.getChallengeTemplateById(challengeTemplateId, challengeTemplate).TemplateName;
  }
  render() {
    const { list } = this.props;

    if (list.length === 0) {
      return (
        <table className='performance-history-table-wrapper'>
          <tbody>
            <tr><td className='no-data-text'>
              <FormattedMessage id={'General.Table.NoData'} />
            </td></tr>
          </tbody>
        </table>
      );
    }

    return (
      <div className='performace-history-list-view'>
        <table className='performance-history-table'>
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
      </div>
    );
  }
}

ListPerformanceHistory.propTypes = {
  challengeTemplate: PropTypes.object,
  equipmentType: PropTypes.number,
  hiddenColumnIndex: PropTypes.array,
  intl: intlShape.isRequired,
  isDritri: PropTypes.bool,
  list: PropTypes.array,
  metricRecords: PropTypes.array,
  uom: PropTypes.object
};
const listPerformanceHistory = connect(state => ({
  challengeTemplate: state.shared_challenges.challengeTemplate
}))(ListPerformanceHistory);
export default injectIntl(listPerformanceHistory);

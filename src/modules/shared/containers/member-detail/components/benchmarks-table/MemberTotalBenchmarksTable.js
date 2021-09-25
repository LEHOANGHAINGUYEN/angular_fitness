import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import * as Helpers from 'common/utils/helpers';
import Constants from 'common/constants/constants';
import { Switch } from 'modules/core/components/switch/Switch';

export class MemberTotalBenchmarksTable extends React.Component {
  constructor(props) {
    super(props);
    Helpers.removeLocalStorage(Constants.LeaderboardOptionalKey);
  }

  handleSwitchChange(value, memberUUId) {
    if (value) {
      Helpers.removeLeaderboardOpt(memberUUId);
    } else {
      Helpers.updateLocalStorage(Constants.LeaderboardOptionalKey, memberUUId, 'array');
    }
  }

  render() {
    const { headerKey, isMulti, list, intl, memberDetail } = this.props;
    let header;
    if (isMulti === 'false') {
      header = (
        <tr>
          {headerKey === 'PersonalBenchmarks.MetricRecords.DriTri'
            ? null : <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.ChallengeType'} /></th>}
          <th>{headerKey ? <FormattedMessage id={headerKey} /> : <FormattedMessage id={'PersonalBenchmarks.MetricRecords.DistanceTime'} />}</th>
          {headerKey === 'PersonalBenchmarks.MetricRecords.DriTri' ? <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.EquipmentType'} /></th> : null}
          <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.CurrentTime'} /></th>
          <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.PreviousTime'} /></th>
          <th><i className='fa fa-star orange-star' /><FormattedMessage id={'PersonalBenchmarks.MetricRecords.BestTime'} /></th>
        </tr>
      );
    }
    else {
      header = (
        <tr>
          {headerKey === 'PersonalBenchmarks.MetricRecords.DriTri'
            ? null : <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.ChallengeType'} /></th>}
          <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.DistanceTime'} /></th>
          <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.CurrentTime'} /></th>
          <th><FormattedMessage id={'PersonalBenchmarks.MetricRecords.PreviousTime'} /></th>
          <th><i className='fa fa-star orange-star' /><FormattedMessage id={'PersonalBenchmarks.MetricRecords.BestTime'} /></th>
        </tr>
      );
    }
    return (
      <div className='member-total-benchmarks-container'>
        <div className='title col-md-6'>
          <FormattedMessage id={'PersonalBenchmarks.Title'} />
        </div>
        <div className='col-md-6 share-data-wrapper'>
          <p className='share-data col-md-7'><FormattedMessage id={'MemberDetail.ShowOnLeaderBoard.Title'} /></p>
          <Switch
            className={'col-md-5'}
            checkedLabel={intl.formatMessage({ id: 'General.Toggle.Show.Title' })}
            uncheckedLabel={intl.formatMessage({ id: 'General.Toggle.Hide.Title' })}
            defaultValue={Helpers.getLeaderboardOpt(memberDetail.MemberUUId)}
            onSwitchChange={(value) => this.handleSwitchChange.bind(this)(value, memberDetail.MemberUUId)} />
        </div>
        <table className='member-total-benchmarks-table'>
          <thead>
            {header}
          </thead>
          <tbody>
            {
              list.length === 0 && (
                <tr>
                  <td className='no-data-text' colSpan='4'>
                    <FormattedMessage id={'General.Table.NoData'} />
                  </td>
                </tr>
              )
            }
            {list.map((e, i) => (
              headerKey === 'PersonalBenchmarks.MetricRecords.DriTri' ?
                <tr key={i}>
                  <td className='name'>{e.name}</td>
                  <td>{e.records[3]}</td>
                  <td>{e.records[0]}</td>
                  <td>{e.records[1]}</td>
                  <td><i className='fa fa-star orange-star' /> {e.records[2]}</td>
                </tr>
                :
                <tr key={i}>
                  <td>{e.records[3]}</td>
                  <td className='name'>{e.name}</td>
                  <td>{e.records[0]}</td>
                  <td>{e.records[1]}</td>
                  <td><i className='fa fa-star orange-star' /> {e.records[2]}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
MemberTotalBenchmarksTable.propTypes = {
  headerKey: PropTypes.string,
  intl: intlShape.isRequired,
  isMulti: PropTypes.string,
  list: PropTypes.array,
  memberDetail: PropTypes.object
};
export default injectIntl(MemberTotalBenchmarksTable);

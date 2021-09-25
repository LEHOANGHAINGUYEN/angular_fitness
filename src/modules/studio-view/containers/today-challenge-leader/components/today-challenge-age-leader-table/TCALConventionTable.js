import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import Constants from 'common/constants/constants';
import { TCLConventionTableItem } from '../../components';
import './styles.scss';
import helpers from 'common/utils/helpers';
export class TCALConventionTable extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Init member into for each age group (rank 1, 2, 3)
   * @param {*} dataGroupByAge Data is group by age group (29AndUnder, 30-39, 40-49, 50+)
   */
  initRankDataForAgeGroup(dataGroupByGender) {
    dataGroupByGender = dataGroupByGender || [];
    let sortableInitRankData = _.sortBy(helpers.filterDataOptLeaderboard(dataGroupByGender), 'Rank');
    for (let i = 24; i > 0; i--) {
      if (!_.find(sortableInitRankData, { Rank: i })) {
        sortableInitRankData.push({ Rank: i });
      }
    }
    helpers.reSortRank(sortableInitRankData);

    // Only get 3 leaders
    sortableInitRankData = _.take(_.sortBy(sortableInitRankData, 'Rank'), 24);

    return sortableInitRankData;
  }

  renderTCLTableAgeGroup(dataGroupByGender, isTop) {
    const {challengeTemplate} = this.props;
    dataGroupByGender = this.initRankDataForAgeGroup(dataGroupByGender);
    let dataGroup = [];
    if (isTop) {
      dataGroup = dataGroupByGender.splice(0, 12);
    } else {
      dataGroup = dataGroupByGender.splice(12, 12);
    }
    return (
      <div className='leader-age-challenge'>
        <div className='table-today-challenge-leader'>
          {
            dataGroup.map((item, index) => {
              return <TCLConventionTableItem item={item} key={index} challengeTemplate={challengeTemplate}/>;
            })
          }
        </div>
      </div>
    );
  }

  render() {
    const { list } = this.props;

    // Group by GenderId
    let groupByGender = _.groupBy(list, 'GenderId');

    // Init data for case Null item
    groupByGender = groupByGender || {};

    return (
      <div className='leader-age-challenge convention'>
        <div className='leader-single-challenge-wapper row'>
          <div className='col-md-6 resize'>
            <div className='gender-convention-header'><FormattedMessage id='TodayChallengeLeader.MenLabel' /></div>
            <table className='table-single-challenge'>
              <thead>
                <tr>
                  <td className='col'>
                    {this.renderTCLTableAgeGroup(groupByGender[Constants.GenderType.Men], true)}
                  </td>
                  <td className='col'>
                    {this.renderTCLTableAgeGroup(groupByGender[Constants.GenderType.Men], false)}
                  </td>
                </tr>
              </thead>
            </table></div>
          <div className='col-md-6 resize'>
            <div className='gender-convention-header'><FormattedMessage id='TodayChallengeLeader.WomenLabel' /></div>
            <table className='table-single-challenge'>
              <thead>
                <tr>
                  <td className='col'>
                    {this.renderTCLTableAgeGroup(groupByGender[Constants.GenderType.Women], true)}
                  </td>
                  <td className='col'>
                    {this.renderTCLTableAgeGroup(groupByGender[Constants.GenderType.Women], false)}
                  </td>
                </tr>
              </thead>
            </table></div>
        </div>
      </div>
    );
  }
}

TCALConventionTable.propTypes = {
  challengeTemplate: PropTypes.object,
  intl: intlShape.isRequired,
  list: PropTypes.array
};

export default injectIntl(TCALConventionTable);


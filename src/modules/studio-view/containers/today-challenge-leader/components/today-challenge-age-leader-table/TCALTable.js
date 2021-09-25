import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import Constants from 'common/constants/constants';
import { TCLTableItem } from '../../components';
import { Helpers } from 'common';
import './styles.scss';

export function TCALTable(props) {
  /**
   * Init data for each age group (29AndUnder, 30-39, 40-49, 50+)
   * @param {array} dataGroupByGender The data is group by gender (Men, Women)
   */
  const initDataWithAgeGroup = dataGroupByGender => {
    dataGroupByGender = dataGroupByGender || {};
    dataGroupByGender[Constants.AgeGroup.Equal29AndUnder] =
      dataGroupByGender[Constants.AgeGroup.Equal29AndUnder] || [];
    dataGroupByGender[Constants.AgeGroup.From30To39] =
      dataGroupByGender[Constants.AgeGroup.From30To39] || [];
    dataGroupByGender[Constants.AgeGroup.From40To49] =
      dataGroupByGender[Constants.AgeGroup.From40To49] || [];
    dataGroupByGender[Constants.AgeGroup.From50AndUpper] =
      dataGroupByGender[Constants.AgeGroup.From50AndUpper] || [];

    return dataGroupByGender;
  };

  /**
   * Init member into for each age group (rank 1, 2, 3)
   * @param {*} dataGroupByAge Data is group by age group (29AndUnder, 30-39, 40-49, 50-59, 60+)
   */
  const initRankDataForAgeGroup = dataGroupByAge => {
    dataGroupByAge = dataGroupByAge || [];

    let sortableInitRankData = _.sortBy(
      Helpers.filterDataOptLeaderboard(dataGroupByAge),
      'Rank'
    );

    for (let i = 3; i > 0; i--) {
      if (!_.find(sortableInitRankData, { Rank: i })) {
        sortableInitRankData.push({ Rank: i });
      }
    }

    Helpers.reSortRank(sortableInitRankData);

    // Only get 3 leaders
    sortableInitRankData = _.take(_.sortBy(sortableInitRankData, 'Rank'), 3);

    return sortableInitRankData;
  };

  const renderTCLTableAgeGroup = (dataGroupByGender, ageGroup) => {
    const { intl, challengeTemplate } = props;
    let ageGroupName;

    switch (ageGroup) {
      case Constants.AgeGroup.Equal29AndUnder:
        ageGroupName = intl.formatMessage({
          id: 'TodayChallengeLeader.Group29AgeLabel'
        });
        break;
      case Constants.AgeGroup.From30To39:
        ageGroupName = '30 - 39';
        break;
      case Constants.AgeGroup.From40To49:
        ageGroupName = '40 - 49';
        break;
      case Constants.AgeGroup.From50To59:
        ageGroupName = '50 - 59';
        break;
      case Constants.AgeGroup.From60AndUpper:
        ageGroupName = '60+';
        break;
      default: {
        ageGroupName = '';
        break;
      }
    }
    dataGroupByGender[ageGroup] = initRankDataForAgeGroup(
      dataGroupByGender[ageGroup]
    );
    return (
      <div className='leader-age-challenge'>
        <div className='table-today-challenge-leader'>
          <p className='title'>{ageGroupName}</p>
          <div className='wrapper-rank'>
          {dataGroupByGender[ageGroup].map((item, index) => {
            return (
              <TCLTableItem
                item={item}
                key={index}
                challengeTemplate={challengeTemplate} />
            );
          })}
          </div>
        </div>
      </div>
    );
  };

  const { list } = props;

  // Group by GenderId
  let groupByGender = _.groupBy(list, 'GenderId');

  // Group by AgeGroupId
  for (let key in groupByGender) {
    groupByGender[key] = _.groupBy(groupByGender[key], 'AgeGroupId');
  }

  // Init data for case Null item
  groupByGender = groupByGender || {};
  groupByGender[Constants.GenderType.Men] = initDataWithAgeGroup(
    groupByGender[Constants.GenderType.Men]
  );
  groupByGender[Constants.GenderType.Women] = initDataWithAgeGroup(
    groupByGender[Constants.GenderType.Women]
  );

  return (
    <div className='leader-age-challenge'>
      <div className='leader-single-challenge-wapper row'>
        <div className='col-md-6 resize'>
          <div className='gender-header'>
            <FormattedMessage id='TodayChallengeLeader.MenLabel' />
          </div>
          <table className='table-single-challenge'>
            <thead>
              <tr>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Men],
                    Constants.AgeGroup.Equal29AndUnder
                  )}
                </td>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Men],
                    Constants.AgeGroup.From30To39
                  )}
                </td>
              </tr>
              <tr>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Men],
                    Constants.AgeGroup.From40To49
                  )}
                </td>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Men],
                    Constants.AgeGroup.From50To59
                  )}
                </td>
              </tr>
              <tr>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Men],
                    Constants.AgeGroup.From60AndUpper
                  )}
                </td>
              </tr>
            </thead>
          </table>
        </div>
        <div className='col-md-6 resize'>
          <div className='gender-header'>
            <FormattedMessage id='TodayChallengeLeader.WomenLabel' />
          </div>
          <table className='table-single-challenge'>
            <thead>
              <tr>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Women],
                    Constants.AgeGroup.Equal29AndUnder
                  )}
                </td>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Women],
                    Constants.AgeGroup.From30To39
                  )}
                </td>
              </tr>
              <tr>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Women],
                    Constants.AgeGroup.From40To49
                  )}
                </td>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Women],
                    Constants.AgeGroup.From50To59
                  )}
                </td>
              </tr>
              <tr>
                <td className='col'>
                  {renderTCLTableAgeGroup(
                    groupByGender[Constants.GenderType.Women],
                    Constants.AgeGroup.From60AndUpper
                  )}
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}

TCALTable.propTypes = {
  challengeTemplate: PropTypes.any,
  intl: intlShape.isRequired,
  list: PropTypes.array
};

export default injectIntl(memo(TCALTable));

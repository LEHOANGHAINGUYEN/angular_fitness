import React from 'react';
import * as _ from 'lodash';
import helpers from 'common/utils/helpers';
import Constants from 'common/constants/constants';
import PropTypes from 'prop-types';
import MemberChallenge from '../challenge-item/MemberChallenge';
class ChallengeRankToday extends React.Component {
  constructor(props) {
    super(props);
  }

  renderRankMale(gender) {
    let sortableInitRankData = _.sortBy(helpers.filterDataOptLeaderboard(gender), 'Rank');
    for (let i = 5; i > 0; i--) {
      if (!_.find(sortableInitRankData, { Rank: i })) {
        sortableInitRankData.push({ Rank: i });
      }
    }
    helpers.reSortRank(sortableInitRankData);
    // Only get 5 leaders
    sortableInitRankData = _.take(_.sortBy(sortableInitRankData, 'Rank'), 5);
    return sortableInitRankData;
  }

  render() {
    const {list, challenge, challengeTemplate} = this.props;
    let groupByGender = _.groupBy(list, 'GenderId');
    let resultMale = this.renderRankMale(groupByGender[Constants.GenderType.Men]);

    let resultFemale = this.renderRankMale(groupByGender[Constants.GenderType.Women]);

    return (
      <div className='temple-body'>
        <div className='gender-male'>
          <div className='tite-gender'>
            <span>{'MALE'}</span>
          </div>
          <div className='top-challenge-day'>
            {resultMale.map((item, i) => (
              <div key={i}>
                <MemberChallenge item={item} challenge={challenge} challengeTemplate={challengeTemplate}/>
              </div>
            ))}
          </div>
        </div>
        <div className='gender-female'>
          <div className='tite-gender'>
            <span>{'FEMALE'}</span>
          </div>
          <div className='top-challenge-day'>
            {resultFemale.map((item, i) => (
              <div key={i}>
                <MemberChallenge item={item} challenge={challenge} challengeTemplate={challengeTemplate}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
ChallengeRankToday.propTypes = {
  challenge: PropTypes.any,
  challengeTemplate: PropTypes.object,
  list: PropTypes.any

};
export default ChallengeRankToday;

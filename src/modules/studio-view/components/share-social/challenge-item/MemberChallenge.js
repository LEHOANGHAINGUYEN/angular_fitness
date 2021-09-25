import React, { Component } from 'react';
import PropTypes from 'prop-types';
class MemberChallenge extends Component {
  constructor(props) {
    super(props);
  }

  renderFormatName(firstName, lastName) {
    if (!firstName) {
      return undefined;
    }

    // Trim name before concatination
    if (lastName) {
      lastName = `${lastName}`.trim();
    }
    if (firstName.length > 16) {
      firstName = `${firstName.slice(0, 16)} ...`;
    }

    return `${firstName.trim()} ${`${lastName || ''}`.charAt(0).toUpperCase()}.`;
  }

  render() {
    const { item, challenge, challengeTemplate } = this.props;
    let isDriTri = challenge
      ? challenge.ChallengeTemplateId === challengeTemplate.DriTri
      : false;
    let emptyResult = isDriTri ? '--:--:--' : '--:--';


    let suffix;
    switch (item.Rank) {
      case 1:
        suffix = 'ST';
        break;
      case 2:
        suffix = 'ND';
        break;
      case 3:
        suffix = 'RD';
        break;
      default:
        suffix = 'TH';
        break;
    }
    return (
      <div className='member-attend'>
        <div className={`rank-number-${item.Rank}`}>
          <p>{item.Rank} </p>
          <sup className='rank-sub'>{suffix}</sup>
        </div>
        <div className='name-number'>
          {this.renderFormatName(item.FirstName, item.LastName) ||
            '--- ---'}
        </div>
        <div className='record-number'>{item.Result || emptyResult}</div>
      </div>
    );
  }
}
MemberChallenge.propTypes = {
  challenge: PropTypes.any,
  challengeTemplate: PropTypes.object,
  item: PropTypes.any

};
export default MemberChallenge;

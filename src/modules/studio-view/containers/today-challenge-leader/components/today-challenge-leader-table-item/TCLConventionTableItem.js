import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';

import * as Helper from 'common/utils/helpers';
import { locale as defaultLocale } from 'localization';

import './styles.scss';

class TCLConventionTableItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { challenge, item, challengeTemplate } = this.props;
    let isDriTri = challenge ? challenge.ChallengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId : false;
    let classTime = item.ClassTime;
    let emptyResult = isDriTri ? '--:--:--' : '--:--';
    let formatedName = Helper.formatMemberName(item.FirstName, item.LastName);

    if (classTime) {
      classTime = moment(classTime).locale(defaultLocale).format('LT');
    }

    return (
      <div className={`row-table-dri-tri${!isDriTri ? ' no-subtitue' : ''} convention`}>
        <div className={`rank rank-convention-${item.Rank} row`}>
          <div className='rank-number'>{item.Rank}</div>
        </div>
        <div className='info'>
          <div className='member convention'>
            <div className='col-md-7 name'>
              {formatedName || '--- ---'}
            </div>
            <div className='col-md-5 time convention'>
              {item.Result || emptyResult}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TCLConventionTableItem.propTypes = {
  actions: PropTypes.any,
  challenge: PropTypes.shape({
    ChallengeId: PropTypes.number,
    ChallengeTemplateId: PropTypes.number
  }),
  challengeTemplate: PropTypes.object,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired,
  item: PropTypes.object,
  substituteType: PropTypes.object
};

export default injectIntl(connect(state => ({
  challenge: state.shared_challenges.todayChallenge,
  currentStudio: state.auth_users.currentStudio,
  errors: state.shared_challenges.errors,
  substituteType: state.shared_challenges.substituteType
}))(TCLConventionTableItem));

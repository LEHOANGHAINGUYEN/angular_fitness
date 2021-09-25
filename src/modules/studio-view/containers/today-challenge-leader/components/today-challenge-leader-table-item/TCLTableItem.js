import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { intlShape, injectIntl } from 'react-intl';

import * as Helper from 'common/utils/helpers';
import { locale as defaultLocale } from 'localization';

import './styles.scss';

const TCLTableItem = (props) => {
  const { challenge, item, intl, challengeTemplate } = props;
  let isDriTri = challenge ? challenge.ChallengeTemplateId === challengeTemplate.DriTri.ChallengeTemplateId : false;
  let classTime = item.ClassTime;
  let className = item.ClassName;
  let emptyResult = isDriTri ? '--:--:--' : '--:--';
  let formatedName = Helper.formatMemberName(item.FirstName, item.LastName);

  if (classTime) {
    classTime = moment(classTime).locale(defaultLocale).format('LT');
  }
  let classInfo = item.ClassName ? `${classTime} - ${className}` : classTime;

  return (
    <div className={`row-table-dri-tri${!isDriTri ? ' no-subtitue' : ''}`}>
      <div className={`rank rank-${item.Rank} row`}>
        <div className='rank-number'>{item.Rank}<sup>{intl.formatMessage({ id: Helper.getOrdinalSuffix(item.Rank) })}</sup></div>
      </div>
      <div className='info'>
        <div className='member'>
          <div className='col-md-7 name'>
            {formatedName || '--- ---'}
          </div>
          <div className='col-md-5 time'>
            {item.Result || emptyResult}
          </div>
        </div>
        <p className='class'>{classInfo || '--- ---'}</p>
      </div>
    </div>
  );
};

TCLTableItem.propTypes = {
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
}))(memo(TCLTableItem)));

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import * as Helpers from 'common/utils/helpers';
import LogoChallenge from '../images/Logo.png';

class HeaderTodayChallenge extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { challenge, intl, currentStudio, challengeTemplate } = this.props;
    let challengeTitle =
      Helpers.getTitleChallenge(challenge.ChallengeTemplateId, challengeTemplate) ||
      intl.formatMessage({ id: 'General.NoChallenge.Title' });
    return (
      <div className='temple-header'>
        <div className='temple-logo'>
          <img src={LogoChallenge} />
        </div>
        <div className='title-challenge'>
          {<FormattedMessage id={challengeTitle} />}
        </div>
        <div className='time-coach'>
          <div className='time'>
            <p>
              <span> {'at'}</span>
              {`${currentStudio.StudioName}`}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
HeaderTodayChallenge.propTypes = {
  challenge: PropTypes.any,
  challengeTemplate: PropTypes.object,
  currentStudio: PropTypes.any,
  intl: intlShape.isRequired
};
export default injectIntl(HeaderTodayChallenge);

/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';

import { ModalType, ModalResult } from 'modules/core/components';
import { Helpers } from 'common';
import './styles.scss';

export class ChallengeItem extends React.Component {
  constructor(props) {
    super(props);
  }


  /**
   * Select challenge event that called redux action to mark this challenge is selected
   */
  selectChallengeTemplate() {
    const { actions, challengeItemTemplate, challengeFilterComp } = this.props;
    const { select } = challengeFilterComp.state;
    const paramChallengeTemplate = {
      ...challengeItemTemplate,
      regionCode: select.regionCode,
      studioId: select.studioId
    };
    actions.shared_challenges.selectChallenge(paramChallengeTemplate);
    actions.core_table.search({
      url: 'corporate/challenges',
      params: {
        pageSize: 15
      }
    });
  }
  /**
   * View challenge
   */
  viewChallenge() {
    // Do something.
  }

  /**
   * Edit challenge
   */
  deleteChallengeTemplate() {
    const { intl, challengeFilterComp, actions, challengeItemTemplate } = this.props;
    const { select } = challengeFilterComp.state;
    const paramChallengeTemplate = {
      ...challengeItemTemplate,
      regionCode: select.regionCode,
      studioId: select.studioId
    };
    actions.shared_challenges.selectedChallengeDelete(paramChallengeTemplate);
    actions.core_modal.show({
      message: intl.formatHTMLMessage({ id: 'Challenge.Confirmation.Delete.Message' }),
      modalType: ModalType.Confirm,
      className: 'delete-confirmation',
      onClose: this.confirmDeleteChallengeTemplate.bind(this)
    });
  }
  confirmDeleteChallengeTemplate(modalResult) {
    const { challengeFilterComp, actions, challengeItemTemplate, paramFilter } = this.props;
    const template = {
      startDate: moment(challengeItemTemplate.StartDate).format('YYYY/MM/DD'),
      endDate: moment(challengeItemTemplate.EndDate).format('YYYY/MM/DD'),
      division: paramFilter.division,
      studioId: paramFilter.studioId,
      challengeTemplateId: challengeItemTemplate.ChallengeTemplateId
    };
    if (modalResult === ModalResult.Ok && challengeFilterComp) {
      actions.shared_challenges.deleteChallengeGroups(
        { template, isDeleteExistingResults: false });
    }
  }

  /**
   * Return template of challenges item component
   */
  render() {
    const format = 'MM/DD/YYYY, hh:mm A';
    const { challengeItemTemplate, challengeTemplate } = this.props;
    const { LogoUrl } = challengeItemTemplate;
    let challengeTitle = Helpers.getTitleChallenge(challengeItemTemplate.ChallengeTemplateId, challengeTemplate) || 'No Today Challenge';
    const startDate = moment(challengeItemTemplate.StartDate).format(format);
    const endDate = moment(challengeItemTemplate.EndDate).format(format);
    return (
      <div className='challenge-item col-md-3'>
        <div className={`thumbnail ${this.props.selectedChallenge === challengeItemTemplate.ChallengeTemplateId ? 'active' : ''}`}>
          <button className='challenge-item-header' onClick={this.selectChallengeTemplate.bind(this)} >
            <div className={'challenge-item-icon'}>
              <img src={LogoUrl} />
            </div>
            <div className='challenge-item-name'>

              <div className='challenge-item-content'>
                {<FormattedMessage id={challengeTitle} />}
                <div className='challenge-date'>
                  <p className='challenge-start-date'>
                    <label>{'Start Date'}</label>
                    <span>{startDate}</span>
                  </p>
                  <p className='challenge-end-date'>
                    <label>{'End Date'}</label>
                    <span>{endDate}</span>
                  </p>
                </div>
              </div>
            </div>
          </button>
          <button type='button' className='close' aria-label='Close'
            onClick={this.deleteChallengeTemplate.bind(this)}>
            {
              /* eslint-disable react/jsx-no-literals */
              <span aria-hidden='true'>&times;</span>
            }
          </button>
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
ChallengeItem.propTypes = {
  actions: PropTypes.any,
  category: PropTypes.object,
  challenge: PropTypes.object,
  challengeFilterComp: PropTypes.object,
  challengeItemTemplate: PropTypes.object,
  challengeTemplate: PropTypes.object,
  deleteChallengeSuccess: PropTypes.bool,
  intl: intlShape.isRequired,
  paramFilter: PropTypes.object,
  selectedChallenge: PropTypes.number
};

const challengeItem = connect(state => ({
  selectedChallenge: state.shared_challenges.selectedChallenge,
  deleteChallengeSuccess: state.shared_challenges.deleteChallengeSuccess,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  paramFilter: state.shared_challenges.paramFilter,
  challengeTemplateTypes: state.shared_challenges.challengeTemplateTypes
}))(ChallengeItem);
export default injectIntl(challengeItem);

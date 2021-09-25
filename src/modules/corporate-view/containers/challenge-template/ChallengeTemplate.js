/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ModalType, ModalResult } from 'modules/core/components/';
import { TemplateFilter, ChallengeTemplateForm, TemplateList } from './components';

import './styles.scss';
import { intlShape, injectIntl } from 'react-intl';

export class ChallengeTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeFilterComp: undefined,
      isDeleteAll: false
    };
  }
  componentWillMount() {
    this.props.actions.shared_challenges.getFitnessType();
  }
  componentWillReceiveProps(newProps) {
    if (newProps && newProps.deleteMessage && newProps.deleteMessage !== this.props.deleteMessage) {
      const { intl } = this.props;
      this.props.actions.core_modal.show({
        message: intl.formatHTMLMessage({ id: 'Challenge.Confirmation.ForceDelete.Message' }),
        modalType: ModalType.Confirm,
        className: 'delete-confirmation',
        onClose: (modalResult) => this.confirmDeleteChallenge.bind(this)(modalResult)
      });
    }
  }
  confirmDeleteChallenge(modalResult) {
    const { selectedChallenge, actions } = this.props;
    if (modalResult === ModalResult.Ok && this.state.challengeFilterComp) {
      actions.shared_challenges.deleteChallenge(
        { listChallenge: [selectedChallenge], isDeleteExistingResults: true }
      );
    }
  }

  /**
   * Open add challenge template modal to add challenge template
   */
  addTemplate() {
    const { actions } = this.props;
    actions.shared_challenges.clearSelectedTemplate();
    actions.core_modal.show({
      title: 'ADD CHALLENGE TEMPLATE',
      modalType: ModalType.Custom,
      size: 'lg',
      component: ChallengeTemplateForm,
      props: { actions: this.props.actions },
      headerClass: 'template-form-header',
      className: 'template-form-modal',
      onClose: this.handleOnChallengeTemplateFormClose.bind(this)
    });
  }

  handleOnChallengeTemplateFormClose(modalResult) {
    if (modalResult === ModalResult.Ok && this.state.challengeFilterComp && this.props.isUpdate) {
      this.state.challengeFilterComp.handleFilterTemplate();
    }
  }

  /**
   * Return content of challenges list for end user
   * <h3>Challenges</h3>    <button>Add Challenge</button>
   * <ChallengeList />
   */
  render() {
    const { fitnessTypeOptions, actions } = this.props;
    return (
      <div className='challenges-wrapper'>
        <div className='row top'>
          <div className='col-md-2 title'>
            <h3>{'Templates'}</h3>
          </div>
          <div className='col-md-8' />
          <div className='col-md-2'>
            <button onClick={this.addTemplate.bind(this)} className='btn btn-primary btn-add'>{'Add Template'}</button>
          </div>
        </div>
        <TemplateFilter
          actions={actions}
          ref={(component) => !this.state.challengeFilterComp && this.setState({ challengeFilterComp: component })}
          fitnessTypeOptions={fitnessTypeOptions} />
        <TemplateList
          actions={actions}
          challengeFilterComp={this.state.challengeFilterComp} />
      </div>
    );
  }
}

/*
* Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
ChallengeTemplate.propTypes = {
  actions: PropTypes.any,
  challengeFilterComp: PropTypes.object,
  challengeTemplate: PropTypes.object,
  challenges: PropTypes.array,
  deleteMessage: PropTypes.string,
  fitnessTypeOptions: PropTypes.array,
  intl: intlShape.isRequired,
  isUpdate: PropTypes.bool,
  selectedChallenge: PropTypes.number
};

const challenges = connect(state => ({
  challenges: state.shared_challenges.challenges,
  currentUser: state.auth_users.currentUser,
  selectedChallenge: state.shared_challenges.selectedChallenge,
  deleteMessage: state.shared_challenges.deleteMessage,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  isUpdate: state.shared_challenges.isUpdate,
  fitnessTypeOptions: state.shared_challenges.fitnessTypeOptions
}))(ChallengeTemplate);
export default injectIntl(challenges);

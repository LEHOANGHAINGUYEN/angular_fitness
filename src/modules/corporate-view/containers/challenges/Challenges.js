/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { ModalType, ModalResult } from 'modules/core/components/';
import { ChallengeFilter, ChallengeForm, ChallengeList } from './components';

import './styles.scss';
import { intlShape, injectIntl } from 'react-intl';

export class Challenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeFilterComp: undefined,
      isDeleteAll: false
    };
  }
  componentWillMount() {
    this.props.actions.shared_challenges.clearSelectedChallenge();
  }

  componentWillReceiveProps(newProps) {
    const {paramFilter} = newProps;
    const additionalQuery = {
      challengeTemplateId: (paramFilter || {}).challengeTemplateId,
      endDate: (paramFilter || {}).endDate,
      startDate: (paramFilter || {}).startDate,
      division: (paramFilter || {}).division,
      regionCode: (paramFilter || {}).regionCode,
      studioId: (paramFilter || {}).studioId,
      equipmentId: (paramFilter || {}).equipmentId,
      countryCode: (paramFilter || {}).countryCode
    };
    if (newProps && newProps.removeChallenge && newProps.removeChallenge !== this.props.removeChallenge) {
      this.props.actions.shared_challenges.filterChallenge(additionalQuery);
    }
    if (newProps.clearChallengeStudio !== this.props.clearChallengeStudio) {
      this.props.actions.core_table.search({
        url: 'corporate/challenges'
      });
    }
    if (newProps && newProps.deleteMessage && newProps.deleteMessage !== this.props.deleteMessage) {
      const { intl } = this.props;
      if (this.state.isDeleteAll) {
        this.props.actions.core_modal.show({
          message: intl.formatHTMLMessage({ id: 'Challenge.Confirmation.ForceDelete.Message' }),
          modalType: ModalType.Confirm,
          className: 'delete-confirmation',
          onClose: (modalResult) => this.confirmForceDeleteAllChallenge.bind(this)(modalResult)
        });
      } else {
        this.props.actions.core_modal.show({
          message: intl.formatHTMLMessage({ id: 'Challenge.Confirmation.ForceDelete.Message' }),
          modalType: ModalType.Confirm,
          className: 'delete-confirmation',
          onClose: (modalResult) => this.confirmDeleteChallenge.bind(this)(modalResult)
        });
      }
    }

    if (newProps.deleteMessageTemplate && newProps
      && newProps.deleteMessageTemplate !== this.props.deleteMessageTemplate) {
      const { intl } = this.props;
      this.props.actions.core_modal.show({
        message: intl.formatHTMLMessage({ id: 'Challenge.Confirmation.ForceDelete.Message' }),
        modalType: ModalType.Confirm,
        className: 'delete-confirmation',
        onClose: (modalResult) => this.confirmDeleteChallengeTemplate.bind(this)(modalResult)
      });
    }
  }

  confirmDeleteChallengeTemplate(modalResult) {
    const { actions, itemChallenge, paramFilter } = this.props;
    const template = {
      startDate: moment(itemChallenge.StartDate).format('YYYY/MM/DD'),
      endDate: moment(itemChallenge.EndDate).format('YYYY/MM/DD'),
      division: paramFilter.division,
      challengeTemplateId: itemChallenge.ChallengeTemplateId,
      studioId: paramFilter.studioId
    };
    if (modalResult === ModalResult.Ok && this.state.challengeFilterComp) {
      actions.shared_challenges.deleteChallengeGroups(
        {template, isDeleteExistingResults: true }
      );
    }
  }
  confirmDeleteChallenge(modalResult) {
    const { selectedChallenge, actions, data } = this.props;
    if (modalResult === ModalResult.Ok && this.state.challengeFilterComp) {
      if (data.length === 1) {
        actions.shared_challenges.deleteChallenge(
          { listChallenge: [selectedChallenge], isDeleteExistingResults: true}
        );
      } else {
        actions.shared_challenges.deleteChallenge(
          { listChallenge: [selectedChallenge], isDeleteExistingResults: true, clearChallengeStudio: true }
        );
      }
    }
  }
  confirmForceDeleteAllChallenge(modalResult) {
    const { actions, data } = this.props;
    if (modalResult === ModalResult.Ok && this.state.challengeFilterComp) {
      let listChallenge = [];
      listChallenge = data.map(challenge => {
        return challenge.ChallengeId;
      });
      actions.shared_challenges.deleteChallenge({ listChallenge, isDeleteExistingResults: true });
    }
    this.setState({
      isDeleteAll: false
    });
  }
  confirmDeleteAllChallenge(modalResult) {
    const { actions, data } = this.props;
    if (modalResult === ModalResult.Ok && this.state.challengeFilterComp) {
      let listChallenge = [];
      listChallenge = data.map(challenge => {
        return challenge.ChallengeId;
      });
      this.setState({
        isDeleteAll: true
      }, ()=>{
        actions.shared_challenges.deleteChallenge({ listChallenge, isDeleteExistingResults: false });
      });
    } else if (modalResult === ModalResult.Cancel) {
      this.setState({
        isDeleteAll: false
      });
    }
  }
  /**
   * Open add challenge modal to add challenge
   */
  addChallenge() {
    this.props.actions.core_modal.show({
      title: 'ADD CHALLENGE',
      modalType: ModalType.Custom,
      size: 'lg',
      component: ChallengeForm,
      props: { actions: this.props.actions },
      headerClass: 'challenge-form-header',
      className: 'challenge-form-modal',
      onClose: this.handleOnChallengeFormClose.bind(this)
    });
  }

  handleOnChallengeFormClose(modalResult) {
    if (modalResult === ModalResult.Ok && this.state.challengeFilterComp) {
      this.state.challengeFilterComp.handleFilter();
    }
  }
  deleteAllChallenge() {
    const { data, dataSize } = this.props;
    if (data.length > 1) {
      this.props.actions.core_table.search({
        url: 'corporate/challenges',
        params: {
          pageSize: dataSize
        }
      });
    }
    this.props.actions.core_modal.show({
      message: this.props.intl.formatHTMLMessage({ id: 'Challenge.Confirmation.DeleteAll.Message' }),
      modalType: ModalType.Confirm,
      className: 'delete-confirmation',
      onClose: (modalResult) => this.confirmDeleteAllChallenge.bind(this)(modalResult, true)
    });
  }
  backGroupChallenge() {
    this.state.challengeFilterComp.handleFilter();
    this.props.actions.shared_challenges.clearSelectedChallenge();
  }
  /**
   * Return content of challenges list for end user
   * <h3>Challenges</h3>    <button>Add Challenge</button>
   * <ChallengeFilter />
   * <ChallengeList />
   */
  render() {
    const { challengeTemplate, isSelectChallenge, paramFilter } = this.props;
    return (
      <div className='challenges-wrapper'>
        {!isSelectChallenge ? <div className='row top '>
          <div className='col-md-2 title'>
            <h3>{'Challenges'}</h3>
          </div>
          <div className='col-md-8' />
          <div className='col-md-2'>
            <button onClick={this.addChallenge.bind(this)} className='btn btn-primary btn-add'>{'Add Challenge'}</button>
          </div>
        </div> :
          <div className='group-challenge-detail'>
            <div className='top-challenge-detail'>
              <div className='col-md-2'>
                <button className='icon-back glyphicon glyphicon-arrow-left' onClick={this.backGroupChallenge.bind(this)} />
              </div>
              <div className='col-md-7' />
              <div className='col-md-3'>
              <div className='btn-action'>
                  <button className='btn btn-delete' onClick={this.deleteAllChallenge.bind(this)}>{'DELETE ALL'}</button>
                </div>
              </div>
            </div>
          </div>
        }

        <div className={`group-challenge-filter ${isSelectChallenge ? 'hidden-filter' : ''}`}>
          <ChallengeFilter
            actions={this.props.actions}
            ref={(component) => !this.state.challengeFilterComp && this.setState({ challengeFilterComp: component })}
            challengeTemplate={challengeTemplate} isSelectChallenge={isSelectChallenge} paramFilter={paramFilter}/>
        </div>
        <ChallengeList
          actions={this.props.actions}
          challengeFilterComp={this.state.challengeFilterComp} />
      </div >
    );
  }
}

/*
* Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Challenges.propTypes = {
  actions: PropTypes.any,
  challengeFilterComp: PropTypes.object,
  challengeTemplate: PropTypes.object,
  challenges: PropTypes.array,
  clearChallengeStudio: PropTypes.bool,
  data: PropTypes.array,
  dataSize: PropTypes.number,
  deleteMessage: PropTypes.string,
  deleteMessageTemplate: PropTypes.bool,
  intl: intlShape.isRequired,
  isSelectChallenge: PropTypes.bool,
  itemChallenge: PropTypes.object,
  paramFilter: PropTypes.object,
  removeChallenge: PropTypes.bool,
  selectedChallenge: PropTypes.number
};

const challenges = connect(state => ({
  challenges: state.shared_challenges.challenges,
  currentUser: state.auth_users.currentUser,
  selectedChallenge: state.shared_challenges.selectedChallenge,
  deleteMessage: state.shared_challenges.deleteMessage,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  isSelectChallenge: state.shared_challenges.isSelectChallenge,
  allChallengeTemplate: state.shared_challenges.allChallengeTemplate,
  paramFilter: state.shared_challenges.paramFilter,
  data: state.core_table.data,
  removeChallenge: state.shared_challenges.removeChallenge,
  clearChallengeStudio: state.shared_challenges.clearChallengeStudio,
  itemChallenge: state.shared_challenges.itemChallenge,
  deleteMessageTemplate: state.shared_challenges.deleteMessageTemplate,
  dataSize: state.core_table.dataSize
}))(Challenges);
export default injectIntl(challenges);

/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';

import { ModalType, ModalResult } from 'modules/core/components';
import ChallengeTemplateForm from '../challenge-template-form/ChallengeTemplateForm';
import { Constants, Helpers } from 'common';
import './styles.scss';

export class TemplateItem extends React.Component {
  constructor(props) {
    super(props);
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
  editChallengeTemplate() {
    this.props.actions.core_modal.show({
      title: 'EDIT CHALLENGE TEMPLATE',
      modalType: ModalType.Custom,
      size: 'lg',
      component: ChallengeTemplateForm,
      props: {
        actions: this.props.actions,
        challengeTemplateId: this.props.template.ChallengeTemplateId,
        template: this.props.template
      },
      headerClass: 'template-form-header',
      className: 'template-form-modal',
      onClose: this.handleOnChallengeTemplateFormClose.bind(this)
    });
  }

  handleOnChallengeTemplateFormClose(modalResult) {
    const { challengeFilterComp } = this.props;

    if (modalResult === ModalResult.Ok && challengeFilterComp && this.props.isUpdate) {
      challengeFilterComp.handleFilterTemplate();
    }
  }
  getImgEquipment(challenge, metricEntry) {
    const { challengeTemplate } = this.props;
    let img = challenge.ChallengeTemplateId === 1 || challenge.ChallengeTemplateId === 5
      ? Helpers.getEnumDescription(Constants.EquipmentType, metricEntry.EquipmentId)
      : Helpers.getEnumDescription(challengeTemplate, challenge.ChallengeTemplateId);
    if (challenge.ChallengeTemplateId === challengeTemplate.MarathonMonth.ChallengeTemplateId) {
      return `marathon ${img}-Marathon`;
    } else if (challenge.ChallengeTemplateId === challengeTemplate.OrangeVoyage.ChallengeTemplateId) {
      return `marathon ${img}-Marathon`;
    }
    return img;
  }
  deleteChallengeTemplate() {
    const { intl } = this.props;
    this.props.actions.core_modal.show({
      message: intl.formatHTMLMessage({ id: 'ChallengeTemplate.Confirmation.Delete.Message' }),
      modalType: ModalType.Confirm,
      className: 'delete-confirmation',
      onClose: this.confirmDeleteChallengeTemplate.bind(this)
    });
  }
  confirmDeleteChallengeTemplate(modalResult) {
    const { challengeFilterComp, template, actions } = this.props;
    if (modalResult === ModalResult.Ok && challengeFilterComp) {
      actions.shared_challenges.deleteChallengeTemplate({ template });
    }
  }

  selectChallengeDetail() {

  }
  /**
   * Return template of challenges item component
   */
  render() {
    const template = (this.props.template || {});
    let templeteName = template.ChallengeTemplateName
      ? template.ChallengeTemplateName
      : `${template.Title} ${Helpers.getEnumDescription(Constants.EquipmentType, template.EquipmentId)} for ${template.EntryType}`;

    return (
      <div className='template-item col-md-3'>
        <div className={'thumbnail'}>
          <button className={`${!template.ChallengeTemplateId ? 'template-item-header-inactive' : ''} template-item-header`} onClick={template.ChallengeTemplateId && this.editChallengeTemplate.bind(this)} >
            <div className={'template-item-icon'}>
              <img src={`${template.LogoUrl}?${new Date().getTime()}`} />
            </div>
            <div className='template-item-name'>
              {templeteName}
            </div>
          </button>
          {template.ChallengeTemplateId && <button type='button' className='close' aria-label='Close'
            onClick={this.deleteChallengeTemplate.bind(this)}>
            {
              // eslint-disable-next-line react/jsx-no-literals
              <span aria-hidden='true'>&times;</span>
            }
          </button>}
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
TemplateItem.propTypes = {
  actions: PropTypes.any,
  category: PropTypes.object,
  challengeFilterComp: PropTypes.object,
  challengeTemplate: PropTypes.object,
  deleteChallengeSuccess: PropTypes.bool,
  intl: intlShape.isRequired,
  isUpdate: PropTypes.bool,
  selectedChallengeTemplate: PropTypes.number,
  template: PropTypes.object
};

const templateItem = connect(state => ({
  selectedChallengeTemplate: state.shared_challenges.selectedChallengeTemplate,
  deleteChallengeSuccess: state.shared_challenges.deleteChallengeSuccess,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  isUpdate: state.shared_challenges.isUpdate
}))(TemplateItem);
export default injectIntl(templateItem);

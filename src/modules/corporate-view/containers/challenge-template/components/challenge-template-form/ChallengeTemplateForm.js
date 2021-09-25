import React from 'react';
import './styles.scss';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormSelect, ImageUpload } from 'modules/core/components';
import { injectIntl } from 'react-intl';

import { Constants } from 'common';
import { SubCategories } from './components/sub-categories/SubCategories';
import MetricField from './components/metric-field/MetricField';
import * as Helper from 'common/utils/helpers';

import validate from '../challenge-template-form/ChallengeTemplateFormValidation';
export class ChallengeTemplateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Logo: '',
      fileName: '',
      challengeTemplateName: '',
      fitnessTypeId: Constants.FitnessType.SignatureWorkout,
      isEdit: false,
      isMultiday: false
    };
  }

  componentWillMount() {
    const { template } = this.props;
    if (template) {
      this.props.actions.shared_challenges.getChallengeTemplateById(template.ChallengeTemplateId);
    }
  }
  componentDidMount() {
    const { template } = this.props;
    if (template) {
      this.setState({
        isEdit: true,
        fitnessTypeId: template.FitnessTypeId,
        isMultiday: template.IsMultiday
      });
    }
  }
  // /**
  //  * This trigger invoked immediately before a component is unmounted and destroyed
  //  * Call get destroy challenge object
  //  */
  componentWillUpdate(nextProps) {
    const { ok } = this.props;
    if (nextProps.editChallengeTemplateSuccess) {
      ok();
    }
  }
  componentWillUnmount() {
    this.props.actions.shared_challenges.destroyChallengeTemplateForm();
  }
  changeTemplateName(e) {
    this.setState({
      challengeTemplateName: e.target.value
    });
  }

  handleSubmit(formValues) {
    const { actions, selectedTemplate } = this.props;
    const entryTypeId = Helper.getEntryType(formValues.MetricEntry.EntryTypeId);
    let metricEntry = formValues.MetricEntry || {};
    if ((metricEntry || {}).EquipmentId !== Constants.EquipmentType.Row
      && entryTypeId === Constants.MetricEntryType.Distance) {
      metricEntry.MaxValue = parseFloat(metricEntry.MaxValue) * Constants.CoefficientUnitMeasurement.Distance;
      metricEntry.MinValue = parseFloat(metricEntry.MinValue) * Constants.CoefficientUnitMeasurement.Distance;
    }
    const value = {
      base64Logo: formValues.Base64Logo,
      challengeTemplateId: (selectedTemplate || {}).ChallengeTemplateId,
      challengeTemplateTypes: formValues.ChallengeTemplateTypes,
      fitnessTypeId: formValues.FitnessTypeId ? formValues.FitnessTypeId : Constants.FitnessType.SignatureWorkout,
      templateName: formValues.TemplateName,
      isMultiday: formValues.IsMultiday ? formValues.IsMultiday : false,
      metricEntry
    };
    if (this.state.isEdit) {
      actions.shared_challenges.updateChallengeTemplate(value);
    } else {
      actions.shared_challenges.insertChallengeTemplate(value);
    }
  }

  renderField({ input, isDisabled, type, options, meta: { touched, error } }) {
    return (
      <div className={`input-form${touched && error ? ' has-error' : ''}`}>
        <input
          className='form-control'
          disabled={isDisabled}
          {...input}
          {...options}
          type={type} />
        {touched && (error && <span className='text-danger-tooltip'>{error}</span>)}
      </div>
    );
  }
  changeFitnessTypeId(newValue) {
    this.setState({
      fitnessTypeId: newValue.value
    }, () => {
      this.props.dispatch(change('challengeTemplateForm', 'FitnessTypeId', this.state.fitnessTypeId));
    });
  }
  handleCheckbox(onChange, key) {
    onChange(!this.state[key]);
    this.setState((prevState) => ({
      [key]: !prevState[key]
    }));
  }
  renderIsMultiday({ isDisabled, input: { onChange } }) {
    return <div>
      <input
        type='checkbox'
        id='isMultiday'
        name='isMultiday'
        checked={this.state.isMultiday}
        disabled={isDisabled}
        onChange={() => this.handleCheckbox.bind(this)(onChange, 'isMultiday')} />
      <label className={'checkbox-custom-label'} htmlFor='isMultiday'>{'Is Multiple-Day'}</label>
    </div>;
  }
  render() {
    const {
      handleSubmit,
      close,
      invalid,
      fitnessTypeOptionsForm,
      selectedTemplate,
      isRangeChanged,
      actions
    } = this.props;
    const isDisabled = selectedTemplate.HasChallenge;
    const { isEdit } = this.state;
    const hasChallenge = (this.props.selectedTemplate || {}).HasChallenge;
    let invalidHasChallenge;
    if (hasChallenge) {
      invalidHasChallenge = isRangeChanged;
    } else {
      invalidHasChallenge = hasChallenge;
    }
    return (
      <form className='challenge-template' onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div className='info-challenge-template' >
          <div className='row'>
            <div className='col-md-6'>
              <label className={'title'}>{'Challenge Template Name'}</label>
              <div className='form-select' >
                <Field
                  name='TemplateName'
                  isDisabled={isDisabled}
                  component={this.renderField} />
              </div>
            </div>
            <div className='col-md-6'>
              <label className={'title'}>{'Type'}</label>
              <FormSelect
                name='FitnessTypeId'
                disabled={isDisabled}
                options={fitnessTypeOptionsForm || []}
                value={this.state.fitnessTypeId}
                onChange={this.changeFitnessTypeId.bind(this)} />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <Field
                name='ChallengeTemplateTypes'
                isDisabled={isDisabled}
                component={SubCategories} />
            </div>
            <div className='col-md-6'>
              <Field
                actions={actions}
                name='MetricEntry'
                isDisabled={isDisabled}
                component={MetricField} />
              <Field
                name='IsMultiday'
                isDisabled={isDisabled}
                component={this.renderIsMultiday.bind(this)} />
            </div>
          </div>

        </div>
        <div className='col-md-12' >
          <div className='content-upload'>
            <Field
              name='Base64Logo'
              isEdit={isEdit}
              isDisabled={isDisabled}
              component={ImageUpload} />
          </div>
        </div>
        <div className='col-md-12'>
          <div className='action-challenge'>
            <button type='button' className='btn btn-cancel' onClick={close} >{'CANCEL'}</button>
            <button type='submit' className='btn btn-primary' disabled={invalid || invalidHasChallenge}>{`${isEdit ? 'UPDATE' : 'ADD'}`}</button>
          </div>
        </div>
      </form>
    );
  }
}
ChallengeTemplateForm.propTypes = {
  actions: PropTypes.any,
  close: PropTypes.any,
  dispatch: PropTypes.func,
  editChallengeTemplateSuccess: PropTypes.bool,
  fitnessTypeOptionsForm: PropTypes.array,
  handleSubmit: PropTypes.func,
  invalid: PropTypes.bool,
  isRangeChanged: PropTypes.bool,
  ok: PropTypes.func,
  selectedTemplate: PropTypes.object,
  template: PropTypes.object
};
let challengeTemplateForm = reduxForm({
  form: 'challengeTemplateForm',  // a unique identifier for this form
  validate,
  enableReinitialize: true
  // <--- validation function given to redux-form
})(ChallengeTemplateForm);

const selector = formValueSelector('challengeTemplate');
challengeTemplateForm = connect(state => ({
  TemplateName: selector(state, 'TemplateName'),
  ChallengeTemplateTypes: selector(state, 'ChallengeTemplateTypes'),
  FitnessTypeId: selector(state, 'FitnessTypeId'),
  base64Logo: selector(state, 'Base64Logo'),
  initialValues: state.shared_challenges.selectedTemplate,
  editChallengeTemplateSuccess: state.shared_challenges.editChallengeTemplateSuccess,
  selectedTemplate: state.shared_challenges.selectedTemplate,
  fitnessTypeOptionsForm: state.shared_challenges.fitnessTypeOptionsForm,
  isRangeChanged: state.shared_challenges.isRangeChanged
}))(challengeTemplateForm);

export default injectIntl(challengeTemplateForm);

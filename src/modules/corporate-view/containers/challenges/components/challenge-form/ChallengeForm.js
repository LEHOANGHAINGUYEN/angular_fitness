/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import Highlighter from 'react-highlight-words';
import { intlShape, injectIntl } from 'react-intl';
import * as _ from 'lodash';

import { AppConstants, Constants, Helpers } from 'common';
import { Calendar, FormSelect, ModalType, ModalResult } from 'modules/core/components';
import validate from './ChallengeFormValidation';
import { StudioService } from 'services';
import * as Helper from 'common/utils/helpers';


import './styles.scss';

export class ChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    // Default value for this challenge entity
    this.state = {
      isEdit: false,
      isAllStudios: false,
      excludeStudio: [],
      individualStudios: []
    };
  }

  /**
   * This trigger is invoked immediately before mounting occurs.
   * Call get challenge entity if this.props.id (challenge-id) is defined
   */
  componentWillMount() {
    this.props.actions.shared_challenges.getChallengeTypes();
  }
  componentDidMount() {
    if (this.props.id) {
      this.setState({
        isEdit: true
      });
      this.props.actions.shared_challenges.getChallenge(this.props.id);
    }
  }

  componentWillUpdate(nextProps) {
    const { challenge, ok, challengeType } = this.props;

    // If previous challenge individual stdios is null
    // then call load options to get item for new challenge individual studio
    if (!challenge.individualStudios && nextProps.challenge.individualStudios) {
      this.studioSelectValue = nextProps.challenge.individualStudioName;
      this.individualStudiosComponent.getRenderedComponent().performLoadOptions();
    }

    if (nextProps.updateChallengeSuccess !== this.props.updateChallengeSuccess) {
      ok();
    }
    if (nextProps.challengeType !== challengeType) {
      if (nextProps.challengeType) {
        this.props.actions.shared_challenges.getChallengeTemplateById(nextProps.challengeType);
      }
    }
  }

  /**
   * This trigger invoked immediately before a component is unmounted and destroyed
   * Call get destroy challenge object
   */
  componentWillUnmount() {
    this.props.actions.shared_challenges.destroyChallengeForm();
  }

  /**
   * Handle submit on challenge form
   * @param {object} formValues The form object includes value to submit
   */
  handleSubmit(formValues) {
    let challenge = _.cloneDeep(formValues);
    const { selectedTemplate } = this.props;
    const newChallenge = { ...challenge, isAddChallenge: true, isMultiday: selectedTemplate.IsMultiday };
    if (this.state.isEdit === true) {
      this.props.actions.shared_challenges.editChallenge(challenge);
    } else {
      this.props.actions.shared_challenges.insertChallenge(newChallenge);
    }
  }

  loadStudioOptions(country, valueName) {
    if (!this[valueName] || this[valueName] === '') {
      return Promise.resolve({ options: [] });
    }

    return StudioService.searchStudio(this[valueName], country)
      .then(res => {
        if (res) {
          let options = res.data.map((item) => {
            return {
              value: item.StudioId,
              label: item.StudioName,
              state: item.StudioState,
              number: item.StudioNumber
            };
          });

          return { options };
        }

        return { options: [] };
      }, () => {
        // Silent handle error
        return { options: [] };
      });
  }


  /**
   * Customize the studio option
   */
  studioOptionRenderer(option, name) {
    return (
      <div>
        <Highlighter
          highlightClassName='highlight-select'
          searchWords={[this[name]]}
          textToHighlight={option.label} />
        <span>{` #${option.number}`}</span>
      </div>
    );
  }

  /**
   * Handle action of check boxes
   * @param {any} onChange
   * @param {any} key
   * @memberof ChallengeForm
   */
  handleCheckbox(onChange, key) {
    onChange(!this.state[key]);
    this.setState((prevState) => ({
      [key]: !prevState[key]
    }));
  }

  /**
   * This function will be wrapped by Redux Form
   * Render unit of measurement field
   */
  renderUnitOfMeasurementField({ input: { value, onChange } }) {
    return (
      <div>
        <input
          type='radio'
          id='imperial'
          name='unitOfMeasurement'
          value={Constants.MeasurementType.Imperial}
          checked={value ? value === Constants.MeasurementType.Imperial : true}
          onChange={() => { onChange(Constants.MeasurementType.Imperial); }} />
        <label className='radio-inline' htmlFor='imperial'><span />{'Imperial'}</label>

        <input
          type='radio'
          id='metric'
          name='unitOfMeasurement'
          value={Constants.MeasurementType.Metric}
          checked={value === Constants.MeasurementType.Metric}
          onChange={() => { onChange(Constants.MeasurementType.Metric); }} />
        <label className='radio-inline' htmlFor='metric'><span />{'Metric'}</label>
      </div>
    );
  }

  /**
   * Render select all studios field
   */
  renderSelectAllStudiosField({ input: { onChange } }) {
    return <div>
      <input
        type='checkbox'
        id='selectAllStudios'
        name='isAllStudios'
        checked={this.state.isAllStudios}
        onChange={() => this.handleCheckbox.bind(this)(onChange, 'isAllStudios')} />
      <label className='checkbox-custom-label all-studio-txt' htmlFor='selectAllStudios'>{'All Studios by Country'}</label>
    </div>;
  }

  /**
   * Render number input field
   *
   * @param {any} { input: { onChange } }
   * @returns
   * @memberof ChallengeForm
   */
  renderNumberRound({ input, meta: { touched, error } }) {
    return (
      <div className='row number-round'>
        <label className={'col-md-4 checkbox-custom-label number-round-txt'}>{'Number Of Rounds'}</label>
        <div className={`col-md-8 input-form${touched && error ? ' has-error' : ''}`}>
          <input {...input}
            className='form-control'
            id='numberOfRound'
            name='numberOfRound'
            type={'number'}
            min={1} />
          {touched && (error && <span className='number-round-error text-danger-tooltip'>{error}</span>)}
        </div>
      </div>);
  }

  deleteChallenge() {
    const { intl } = this.props;
    this.props.actions.core_modal.show({
      message: intl.formatHTMLMessage({ id: 'Challenge.Confirmation.Delete.Message' }),
      modalType: ModalType.Confirm,
      className: 'delete-confirmation',
      onClose: this.confirmDeleteChallenge.bind(this)
    });
  }
  confirmDeleteChallenge(modalResult) {
    const { challengeFilterComp, selectedChallenge, actions, data } = this.props;
    if (modalResult === ModalResult.Ok && challengeFilterComp) {
      actions.shared_challenges.getSelectedChallenge(selectedChallenge);
      if (data.length === 1) {
        actions.shared_challenges.deleteChallenge({
          listChallenge: [selectedChallenge],
          isDeleteExistingResults: false
        });
      } else {
        actions.shared_challenges.deleteChallenge({
          listChallenge: [selectedChallenge],
          isDeleteExistingResults: false, clearChallengeStudio: true
        });
      }
    }
  }
  changeExcludeStudio(newValue) {
    this.setState({
      excludeStudio: newValue
    }, () => {
      let excludeStudioIds = this.state.excludeStudio.map((item) => {
        return item.value;
      });
      this.props.dispatch(change('challengeForm', 'excludeStudio', excludeStudioIds));
    });
  }

  renderStudioExclusion() {
    return <FormSelect
      async={true}
      cache={false}
      ref={(component) => { this.excludeStudiosComponent = component; }}
      placeholder={'Select Studio...'}
      onInputChange={(value) => { this.studioExcludeSelectValue = value; }}
      optionRenderer={(option) => this.studioOptionRenderer.bind(this)(option, 'studioExcludeSelectValue')}
      loadOptions={() => this.loadStudioOptions.bind(this)(this.props.country, 'studioExcludeSelectValue')}
      withRef={true}
      multi={true}
      value={this.state.excludeStudio}
      disabled={!this.state.isAllStudios}
      onChange={this.changeExcludeStudio.bind(this)} />;
  }
  renderSelectMultipleDayField() {
    const { selectedTemplate } = this.props;
    return <div className='multiple-day'>
      <input
        type='checkbox'
        id='isMultiple'
        name='isMultipleDay'
        defaultChecked={selectedTemplate.IsMultiday}
        disabled='true' />
      <label className='checkbox-custom-label-mutiple all-studio-txt' htmlFor='isMultiple'>{'Is Multiple Day'}</label>
    </div>;
  }

  changeIndividualStudio(newValue) {
    this.setState({
      individualStudios: newValue
    }, () => {
      let individualStudioIds = this.state.individualStudios.map((item) => {
        return item.value;
      });
      this.props.dispatch(change('challengeForm', 'individualStudios', individualStudioIds));
    });
  }
  renderIndividualStudios() {
    return <FormSelect
      async={true}
      cache={false}
      ref={(component) => { this.individualStudiosComponent = component; }}
      placeholder={'Select Studio...'}
      onInputChange={(value) => { this.studioSelectValue = value; }}
      optionRenderer={(option) => this.studioOptionRenderer.bind(this)(option, 'studioSelectValue')}
      loadOptions={() => this.loadStudioOptions.bind(this)(this.props.country, 'studioSelectValue')}
      withRef={true}
      multi={true}
      clearable={true}
      disabled={this.state.isAllStudios}
      value={this.state.individualStudios}
      onChange={this.changeIndividualStudio.bind(this)} />;
  }
  render() {
    const format = 'MM/DD/YYYY';
    const {
      handleSubmit,
      invalid,
      startDate,
      close,
      challengeStartDate,
      challengeEndDate,
      challengeTemplate,
      selectedTemplate
    } = this.props;
    let formattedStartDate = moment(challengeStartDate).format(format);
    let formattedEndDate = moment(challengeEndDate).format(format);
    const challengeCategorySelect = Helpers.createListChallengeTemplate(challengeTemplate);
    const metricField = selectedTemplate.MetricEntry || {};
    const entryTypeId = Helper.getEntryType((metricField || {}).EntryTypeId);
    let minValue = metricField.MinValue;
    let maxValue = metricField.MaxValue;
    if ((metricField || {}).EquipmentId !== Constants.EquipmentType.Row
      && entryTypeId === Constants.MetricEntryType.Distance) {
      maxValue = _.round(parseFloat(maxValue) / Constants.CoefficientUnitMeasurement.Distance, 3);
      minValue = _.round(parseFloat(minValue) / Constants.CoefficientUnitMeasurement.Distance, 3);
    }
    const entryType = Helper.getEntryType(metricField.EntryTypeId);
    if ((metricField || {}).EquipmentId !== Constants.EquipmentType.Row
      && entryType === Constants.MetricEntryType.Distance) {
      metricField.MaxValue = parseFloat(metricField.MaxValue) / Constants.CoefficientUnitMeasurement.Distance;
      metricField.MinValue = parseFloat(metricField.MinValue) / Constants.CoefficientUnitMeasurement.Distance;
    }
    return (
      <form className='challenge-form' onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div className='info-challenge row'>
          <div className='col-md-6'>
            <div className='label-group'>{'Select studios'}</div>
            {!this.state.isEdit && <Field
              name='isAllStudios'
              component={this.renderSelectAllStudiosField.bind(this)} />}
            <Field
              name='country'
              options={AppConstants.challengeFormSelect.country}
              component={FormSelect} />
            <label className={`title${this.state.isAllStudios ? ' disabled-txt' : ''}`}>{'Individual Studios'}</label>
            {!this.state.isEdit && <Field
              name='individualStudios'
              component={this.renderIndividualStudios.bind(this)} />}
            {this.state.isEdit && <Field
              name='individualStudios'
              async={true}
              cache={false}
              ref={(component) => { this.individualStudiosComponent = component; }}
              placeholder={'Select Studio...'}
              onInputChange={(value) => { this.studioSelectValue = value; }}
              optionRenderer={(option) => this.studioOptionRenderer.bind(this)(option, 'studioSelectValue')}
              loadOptions={() => this.loadStudioOptions.bind(this)(this.props.country, 'studioSelectValue')}
              withRef={true}
              multi={true}
              clearable={true}
              disabled={this.state.isAllStudios}
              component={FormSelect} />}
            {!this.state.isEdit && <label className={`title${!this.state.isAllStudios ? ' disabled-txt' : ''}`}>{'Excluded Studio'}</label>}
            {!this.state.isEdit && <Field
              name='excludeStudios'
              component={this.renderStudioExclusion.bind(this)} />}
          </div>
          <div className='col-md-6'>
            <div className='label-group'>{'Challenge'}</div>
            <label className='title'>{'Challenge Template'}</label>
            <Field
              name='challengeType'
              options={challengeCategorySelect}
              searchable={false}
              component={FormSelect} />
            <Field
              name='numberOfRound'
              component={this.renderNumberRound.bind(this)} />
            <Field
              name='isMultipleDay'
              component={this.renderSelectMultipleDayField.bind(this)} />
            <label>{'Metric Field'}</label>
            <div className='col-md-12 metric-entry-field metric-field'>
              {`${metricField.MetricTitle} ${Helpers.getEnumDescription(
                Constants.EquipmentType,
                metricField.EquipmentId
              )} (${entryType})
              ${minValue ? `Min: ${minValue}` : ''} 
              ${maxValue ? `Max: ${maxValue}` : ''}`}
            </div>
          </div>
        </div>
        <div className='info-challenge row'>
          <div className='label-group-date'>{'Date'}</div>
          <div className='col-md-6'>
            <label className='title'>{'Start Date'}</label>
            <div className='row'>
              <div className='col-md-8'>
                <Field
                  name='startDate'
                  options={{ format, selectedDate: formattedStartDate }}
                  component={Calendar} />
              </div>
              <div className='col-md-4 clock-section'>
                <span className='clock'>&nbsp;{'12:00 AM'}</span>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <label className={`title ${!selectedTemplate.IsMultiday ? 'disabled-txt' : ''}`}>{'End Date'}</label>
            <div className='row'>
              <div className='col-md-8 '>
                <Field
                  name='endDate'
                  options={{
                    format, selectedDate: formattedEndDate,
                    minDate: startDate
                  }}
                  isMultiday={selectedTemplate.IsMultiday}
                  component={Calendar} />
              </div>
              <div className='col-md-4 clock-section'>
                <span className='clock'>&nbsp;{'11:59 PM'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='action-challenge row'>
          <button type='button' className='btn btn-cancel' onClick={close}>{'CANCEL'}</button>
          {this.state.isEdit && <button type='button' className='btn btn-danger' onClick={this.deleteChallenge.bind(this)}>{'DELETE'}</button>}
          <button type='submit' className='btn btn-primary' disabled={invalid}>{this.state.isEdit ? 'UPDATE' : 'ADD'}</button>
        </div>
      </form>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */

ChallengeForm.propTypes = {
  actions: PropTypes.any,
  challenge: PropTypes.any,
  challengeEndDate: PropTypes.string,
  challengeFilterComp: PropTypes.object,
  challengeStartDate: PropTypes.string,
  challengeTemplate: PropTypes.object,
  challengeType: PropTypes.any,
  change: PropTypes.func,
  close: PropTypes.any,
  country: PropTypes.string,
  data: PropTypes.array,
  disableCheckboxAllStudio: PropTypes.bool,
  dispatch: PropTypes.func,
  endDate: PropTypes.any,
  handleSubmit: PropTypes.func,
  id: PropTypes.number,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  numberOfRound: PropTypes.number,
  ok: PropTypes.func,
  selectedChallenge: PropTypes.number,
  selectedTemplate: PropTypes.object,
  startDate: PropTypes.any,
  updateChallengeSuccess: PropTypes.bool
};

let challengeForm = reduxForm({
  form: 'challengeForm', // A unique identifier for this form
  validate,
  enableReinitialize: true
})(ChallengeForm);

// Decorate with connect to read form values
const selector = formValueSelector('challengeForm');
challengeForm = connect(state => ({
  endDate: selector(state, 'endDate'),
  challenge: state.shared_challenges.challenge,
  challengeType: selector(state, 'challengeType'),
  initialValues: state.shared_challenges.challenge,
  startDate: selector(state, 'startDate'),
  country: selector(state, 'country'),
  selectAllStudios: selector(state, 'selectAllStudios'),
  updateChallengeSuccess: state.shared_challenges.updateChallengeSuccess,
  studiosOption: state.shared_studios.studiosOption,
  challengeTemplate: state.shared_challenges.challengeTemplate,
  fitnessTypeOptions: state.shared_challenges.fitnessTypeOptions,
  selectedTemplate: state.shared_challenges.selectedTemplate
}))(challengeForm);

export default injectIntl(challengeForm);

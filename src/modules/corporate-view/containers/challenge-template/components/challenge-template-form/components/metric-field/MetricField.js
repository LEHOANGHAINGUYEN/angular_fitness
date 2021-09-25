/**
 * React / Redux dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Field, formValueSelector } from 'redux-form';
import { default as Constants, SelectOptionsConstants } from 'common/constants/constants';
import { FormSelect } from 'modules/core/components';
import NumberFormat from 'react-number-format';
import * as Helper from 'common/utils/helpers';

import './styles.scss';

export class MetricField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      select: {
        equipmentId: Constants.EquipmentType.Row,
        type: Constants.MetricEntryType.Distance,
        measureType: Constants.MetricMeasurement.Min,
        minValue: '',
        maxValue: ''
      }
    };
  }
  componentWillReceiveProps(newProps) {
    const { MetricEntry } = newProps;
    if (newProps.MetricEntry !== this.props.MetricEntry) {
      const entryTypeId = Helper.getEntryType((MetricEntry || {}).EntryTypeId);
      const notRowDistance = (MetricEntry || {}).EquipmentId !== Constants.EquipmentType.Row
        && entryTypeId === Constants.MetricEntryType.Distance;
      if (notRowDistance) {
        MetricEntry.MaxValue = _.round(parseFloat(MetricEntry.MaxValue) / Constants.CoefficientUnitMeasurement.Distance,
          3);
        MetricEntry.MinValue = _.round(parseFloat(MetricEntry.MinValue) / Constants.CoefficientUnitMeasurement.Distance,
          3);
      }
      this.setState({
        select: {
          equipmentId: (MetricEntry || {}).EquipmentId ? MetricEntry.EquipmentId : Constants.EquipmentType.Row,
          type: (MetricEntry || {}).EntryTypeId
            ? Helper.getEntryType(MetricEntry.EntryTypeId)
            : Constants.MetricEntryType.Distance,
          measureType: (MetricEntry || {}).MetricKey 
            ? this.convertMeasureType(MetricEntry.MetricKey)
            : Constants.MetricMeasurement.Min,
          minValue: (MetricEntry || {}).MinValue ? _.round(MetricEntry.MinValue, 3) : '',
          maxValue: (MetricEntry || {}).MaxValue ? _.round(MetricEntry.MaxValue, 3) : ''
        }
      });
    }
  }
  componentDidUpdate() {
    const { input: { onChange }, Title, MetricEntry } = this.props;
    const { select: { measureType, equipmentId, type, minValue, maxValue } } = this.state;
    // Check if title is empty then return
    if (!Title) { return; }

    let metricEntry = {
      MetricKey: `${Title}${measureType}`,
      MetricTitle: `${Title} ${measureType}`,
      EquipmentId: equipmentId,
      EntryTypeId: Helper.getEntryTypeId(type),
      MinValue: minValue,
      MaxValue: maxValue
    };
    onChange(metricEntry);
    if ((_.get(MetricEntry, 'MinValue') || '').toString() !== minValue.toString() || (_.get(MetricEntry, 'MaxValue') || '').toString() !== maxValue.toString()) {
      this.props.actions.shared_challenges.checkRangeChanged();
    } else {
      this.props.actions.shared_challenges.undoCheckRangeChanged();
    }
  }

  convertMeasureType(metricKey) {
    return metricKey.replace(/\d+([,.]\d+)?\s*/g, '');
  }
  handleChange(e, type) {
    let data = e.target ? e.target.value : e.formattedValue;
    this.setState(state => {
      return {
        ...state,
        select: {
          ...state.select,
          [type]: data
        }
      };
    });
  }
  renderDefaultEntryTypeOption(type) {
    switch (type) {
      case Constants.MetricEntryType.Distance:
        return SelectOptionsConstants.EntryTypeDistanceOptions[0];
      case Constants.MetricEntryType.Reps:
        return SelectOptionsConstants.EntryTypeRepsOptions[0];
      default:
        return SelectOptionsConstants.EntryTypeOptions[0];
    }
  }


  /**
   * Handle select change event
   * @param {string} name The name of select
   * @param {any} newValue The new value of select component
   */
  handleSelectChange(name, newValue) {
    let selectState = this.state.select;
    selectState[name] = newValue.value;
    selectState.minValue = '';
    selectState.maxValue = '';

    if (name === 'type') {
      switch (newValue.value) {
        case Constants.MetricEntryType.Distance:
          selectState.measureType = SelectOptionsConstants.MeasurementTypeTimeOptions[0].value;
          break;
        case Constants.MetricEntryType.Time:
          selectState.measureType = SelectOptionsConstants.MeasurementTypeMeterOptions[0].value;
          break;
        case Constants.MetricEntryType.Reps:
          selectState.measureType = SelectOptionsConstants.MeasurementTypeRepsOptions[0].value;
          break;
        default:
          selectState.measureType = SelectOptionsConstants.MeasurementTypeTimeOptions[0].value;
      }
    }

    if (name === 'equipmentId') {
      switch (newValue.value) {
        case Constants.EquipmentType.WeightFloor:
          selectState.type = SelectOptionsConstants.EntryTypeRepsOptions[0].value;
          break;
        case Constants.EquipmentType.Row:
        case Constants.EquipmentType.Treadmill:
        case Constants.EquipmentType.Strider:
        case Constants.EquipmentType.PowerWalker:
        case Constants.EquipmentType.Bike:
          selectState.type = SelectOptionsConstants.EntryTypeDistanceOptions[0].value;
          break;
        default:
          selectState.type = SelectOptionsConstants.EntryTypeDistanceOptions[0].value;
          break;
      }
    }

    switch (this.state.select.type) {
      case Constants.MetricEntryType.Distance:
        selectState.measureType =
          SelectOptionsConstants.MeasurementTypeTimeOptions[0].value;
        break;
      case Constants.MetricEntryType.Reps:
        selectState.measureType =
          SelectOptionsConstants.MeasurementTypeRepsOptions[0].value;
        break;
      case Constants.MetricEntryType.Time:
        if (this.state.select.measureType === 'METER') {
          selectState.measureType =
            SelectOptionsConstants.MeasurementTypeMeterOptions[0].value;
        } else if (this.state.select.measureType === 'MILE') {
          selectState.measureType =
            SelectOptionsConstants.MeasurementTypeMeterOptions[1].value;
        }
        break;
      default:
        selectState.measureType =
          SelectOptionsConstants.MeasurementTypeTimeOptions[0].value;
        break;
    }
    this.setState({
      select: selectState
    });
  }

  renderMeasurementTypeOptions() {
    switch (this.state.select.type) {
      case Constants.MetricEntryType.Distance:
        return SelectOptionsConstants.MeasurementTypeTimeOptions;
      case Constants.MetricEntryType.Time:
        return SelectOptionsConstants.MeasurementTypeMeterOptions;
      case Constants.MetricEntryType.Reps:
        return SelectOptionsConstants.MeasurementTypeRepsOptions;
      default:
        return SelectOptionsConstants.MeasurementTypeOptions;
    }
  }

  renderEntryTypeOption() {
    if (this.state.select.equipmentId !== 6) {
      return SelectOptionsConstants.EntryTypeOptions;
    }
    return SelectOptionsConstants.EntryTypeRepsOptions;
  }
  renderMetricTitle({ input, isDisabled, options, meta: { touched, error } }) {
    return (
      <div className={`input-form${touched && error ? ' has-error' : ''}`}>
        <input
          {...input}
          {...options}
          className='form-control'
          disabled={isDisabled}
          name='title'
          type='number'
          step='0.01'
          min={1} />
        {touched && (error && <span className='text-danger-tooltip'>{error}</span>)}
      </div>
    );
  }
  /**
   * Return template of challenges add component
   */
  render() {
    const { select } = this.state;
    const { isDisabled } = this.props;
    const isRower = select.equipmentId === Constants.EquipmentType.Row;
    return (
      <div className='form-metric'>
        <label className='title'>{'Metric Field'}</label>
        <div className='row'>
          <div className='col-md-12'>
            <div className='row form-group'>
              <div className='col-md-6'>
                <Field
                  name='Title'
                  isDisabled={isDisabled}
                  component={this.renderMetricTitle} />
              </div>
              <div className='col-md-6'>
                <FormSelect
                  name='measureType'
                  searchable={false}
                  disabled={isDisabled}
                  value={select.measureType}
                  options={this.renderMeasurementTypeOptions()}
                  onChange={this.handleSelectChange.bind(this, 'measureType')} />
              </div>
            </div>
            <div className='row form-group'>
              <div className='col-md-6'>
                <FormSelect
                  name='equipmentId'
                  searchable={false}
                  disabled={isDisabled}
                  value={select.equipmentId}
                  options={SelectOptionsConstants.EquipmentTypeOptions}
                  onChange={this.handleSelectChange.bind(this, 'equipmentId')} />
              </div>
              <div className='col-md-6'>
                <FormSelect
                  name='type'
                  searchable={false}
                  disabled={isDisabled}
                  value={select.type}
                  options={this.renderEntryTypeOption()}
                  onChange={this.handleSelectChange.bind(this, 'type')} />
              </div>
            </div>
            {select.type !== Constants.MetricEntryType.Reps &&
              select.type !== Constants.MetricEntryType.Time &&
              <div className='row form-group'>
                <p className='col-md-2 range'>{'Min'}</p>
                <div className='col-md-4'>
                  <input
                    id={'minValue'}
                    name='min'
                    className='form-control'
                    value={this.state.select.minValue}
                    type={'text'}
                    onChange={(e) => this.handleChange(e, 'minValue')} />
                </div>
                <p className='col-md-2 range'>{'Max'}</p>
                <div className='col-md-4'>
                  <input
                    id={'maxValue'}
                    name='max'
                    className='form-control'
                    value={this.state.select.maxValue}
                    type={'text'}
                    onChange={(e) => this.handleChange(e, 'maxValue')} />
                </div>
              </div>
            }
            {select.type !== Constants.MetricEntryType.Reps &&
              select.type === Constants.MetricEntryType.Time &&
              <div className='row form-group'>
                <p className='col-md-2 range'>{'Min'}</p>
                <div className='col-md-4'>
                  <NumberFormat
                    id={'minValue'}
                    name='min'
                    format={isRower ? '##:##.##' : '##:##'}
                    value={select.minValue}
                    onValueChange={(e) => this.handleChange(e, 'minValue')}
                    className='form-control'
                    placeholder={isRower ? 'mm:ss.SS' : 'mm:ss'}
                    mask={['m', 'm', 's', 's', 'S', 'S']} />
                </div>
                <p className='col-md-2 range'>{'Max'}</p>
                <div className='col-md-4'>
                  <NumberFormat
                    id={'maxValue'}
                    name='max'
                    format={isRower ? '##:##.##' : '##:##'}
                    value={select.maxValue}
                    onValueChange={(e) => this.handleChange(e, 'maxValue')}
                    className='form-control'
                    placeholder={isRower ? 'mm:ss.SS' : 'mm:ss'}
                    mask={['m', 'm', 's', 's', 'S', 'S']} />
                </div>
              </div>
            }
          </div>
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
MetricField.propTypes = {
  MetricEntry: PropTypes.object,
  Title: PropTypes.string,
  actions: PropTypes.any,
  input: PropTypes.object, // The props under the input key are what connects your input component to Redux,
  isDisabled: PropTypes.bool
};
const selector = formValueSelector('challengeTemplateForm');
let metricField = connect(state => ({
  Title: selector(state, 'Title'),
  MetricEntry: state.shared_challenges.selectedTemplate.MetricEntry
}))(MetricField);
export default metricField;

/**
 * React / Redux dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { intlShape } from 'react-intl';
import Highlighter from 'react-highlight-words';

import 'react-select/dist/react-select.css';
import './styles.scss';

/**
 * Using react select for this customization
 * Reference to: https://github.com/JedWatson/react-select#usage
 */
export class FormSelect extends React.Component {
  constructor(props) {
    super(props);
    this.performLoadOptions = this.performLoadOptions.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.resetOptions) {
      this.performLoadOptions();
    }
  }
  /**
   * Handle when this option value is changed
   */
  handleSelectChange(value) {
    // Get props from Field Redux Form
    const { input, onOptionChange } = this.props;
    const onChange = (input || {}).onChange;
    if (typeof onChange === 'function') {
      if (value === null) {
        value = '';
        onChange(value);
      } else {
        onChange(value.value);
      }

      if (typeof onOptionChange === 'function') {
        onOptionChange(value);
      }
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

  /**
   * Handle when the input is changed
   */
  handleOnInputChange(value) {
    this.inputValue = value;
    if (typeof this.props.onInputChange === 'function') {
      this.props.onInputChange(value);
    }
  }

  /**
   * Handle options renderer
   */
  optionRenderer(option) {
    const { intl } = this.props;
    let label = intl && option.i18nKey ? intl.formatMessage({ id: option.i18nKey }) : option.label;
    // If this.props.enableHighligh value is true then return Highligher
    if (this.props.enableHighlight) {
      return (
        <Highlighter
          highlightClassName='highlight-select'
          searchWords={[this.inputValue]}
          textToHighlight={label} />
      );
    }

    return label;
  }

  /**
   * Handle value renderer
   */
  valueRenderer(option) {
    const { intl } = this.props;
    let label = intl && option.i18nKey ? intl.formatMessage({ id: option.i18nKey }) : option.label;

    return label;
  }

  /**
   * Manual call loadOptions
   * This function just works with async option
   */
  performLoadOptions() {
    if (this.select && this.props.async) {
      this.select.loadOptions();
    }
  }

  handleOnBlur() {
    const { input } = this.props;

    if (input) {
      input.onBlur(input.value);
    }
  }

  /**
   * Render select component that load async options
   */
  renderAsyncSelectComponent() {
    let { props } = this;

    return (
      <Select.Async
        ref={(select) => { this.select = select; }}
        onInputChange={this.handleOnInputChange.bind(this)}
        className={this.props.className || ''}
        value={props.value || (this.props.input || {}).value}
        clearable={props.clearable || false}
        loadOptions={props.loadOptions}
        onChange={this.handleSelectChange.bind(this)}
        optionRenderer={props.optionRenderer || this.optionRenderer.bind(this)}
        valueRenderer={props.valueRenderer}
        placeholder={props.placeholder}
        onBlur={this.handleOnBlur.bind(this)}
        disabled={props.disabled}
        searchable={props.searchable}
        cache={props.cache}
        multi={props.multi}
        onOpen={props.onOpen}/>
    );
  }

  /**
   * Render select component that load sync options
   */
  renderSyncSelectComponent() {
    let { props } = this;

    return (
      <Select
        onInputChange={this.handleOnInputChange.bind(this)}
        className={props.className || ''}
        value={props.value || (props.input || {}).value}
        clearable={props.clearable || false}
        options={props.options}
        onChange={this.handleSelectChange.bind(this)}
        optionRenderer={props.optionRenderer || this.optionRenderer.bind(this)}
        valueRenderer={props.valueRenderer || this.valueRenderer.bind(this)}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onBlur={this.handleOnBlur.bind(this)}
        searchable={props.searchable}
        multi={props.multi}
        onOpen={props.onOpen}/>
    );
  }

  render() {
    const meta = this.props.meta || {};
    const { touched, error } = meta;

    return (
      <div className={`form-select ${touched && error ? ' has-error' : ''}`}>
        {
          this.props.async ?
            this.renderAsyncSelectComponent() :
            this.renderSyncSelectComponent()
        }
        {touched && (error && <span className='text-danger-tooltip'>{error}</span>)}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
FormSelect.propTypes = {
  async: PropTypes.bool,
  cache: PropTypes.any,
  className: PropTypes.string, // Customize css for this form select
  clearable: PropTypes.bool, // Should it be possible to reset value. Default is false
  disabled: PropTypes.any,
  enableHighlight: PropTypes.bool, // Enable the highlight on search. Default is false
  input: PropTypes.object, // The props under the input key are what connects your input component to Redux
  intl: intlShape,
  loadOptions: PropTypes.func, // Required if async is True, provide callback(err, data) in a Object { options: [] }
  meta: PropTypes.object,
  multi: PropTypes.any,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func, // Function is involved when input text value is changed
  onOpen: PropTypes.func, // Handler for when the menu opens
  onOptionChange: PropTypes.func, // This function is the same with onChange, but just work if form-select is wrapped by ReduxForm Field
  optionRenderer: PropTypes.func, // Render options
  options: PropTypes.array, // Required if async is False, should be provided as an Array of Objects, each with a value and label property for rendering and searching., // Render value options
  placeholder: PropTypes.string,
  resetOptions: PropTypes.bool,
  searchable: PropTypes.bool,
  value: PropTypes.any,
  valueRenderer: PropTypes.func
};


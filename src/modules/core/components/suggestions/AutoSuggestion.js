import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';

import './styles.scss';
import * as Helpers from 'common/utils/helpers';

class AutoSuggestion extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let triggerAction = 'focus paste keyup custom';
    if (Helpers.mobileAndTabletCheck()) {
      triggerAction += ' change';
    }

    const fetchingDebounce = debounce(this.handleChange.bind(this), 400);

    $(`#${this.props.input.id}`).on(triggerAction, fetchingDebounce);
  }

  componentWillReceiveProps(newProps) {
    if ((newProps.selectedValue !== this.props.selectedValue) && !newProps.selectedValue) {
      this.props.onSuggestionsClearRequested();
    }
  }

  onChange(event, newValue) {
    this.props.onChange(event, newValue);
  }

  handleOnBlur() {
    const { onInputBlur } = this.props;

    if (onInputBlur && typeof onInputBlur === 'function') {
      onInputBlur();
    }
  }

  onSuggestionsFetchRequested(value) {
    this.props.onSuggestionsFetchRequested(value);
  }

  onSuggestionsClearRequested() {
    this.props.onSuggestionsClearRequested();
  }

  getSuggestionValue(suggestion) {
    const { changeSuggestion } = this.props;
    if (changeSuggestion) {
      changeSuggestion(suggestion);
    }
    let val = this.props.getSuggestionValue(suggestion);
    $(`#${this.props.input.id}`).val(val);
    $(`#${this.props.input.id}`).trigger('custom', ['SelectValue']);
    $('#autowhatever').removeClass('autosuggest-suggestions-container--open');
    $('.autosuggest-container').removeClass('autosuggest-container--open');
  }

  handleChange(e, param) {
    const input = $(`#${this.props.input.id}`);
    this.onChange(e, input.val());
    if (!param) {
      this.onSuggestionsFetchRequested(input.val());
      $('#autowhatever').addClass('autosuggest-suggestions-container--open');
      $('.autosuggest-container').addClass('autosuggest-container--open');
    }

    $('#root').on('click', () => {
      $('#autowhatever').removeClass('autosuggest-suggestions-container--open');
      $('.autosuggest-container').removeClass('autosuggest-container--open');
      $('#root').off('click');

      return true;
    });
  }

  render() {
    const { intl, disableAutoSearch } = this.props;
    const inputVal = $(`#${this.props.input.id}`).val();
    let placeholder = this.props.input.i18Key ? intl.formatMessage({ id: this.props.input.i18Key })
      : this.props.input.placeholder;
    let fetchingMsg = intl.formatMessage({ id: 'General.ServerFetching' });
    let noResultFound = intl.formatMessage({ id: 'General.NoSuggestion' });
    const suggestions = (!disableAutoSearch && this.props.suggestions.length === 0 ? (<ul role='listbox' className='autosuggest-suggestions-list'>
      {
        <li role='option'
          className='autosuggest-suggestion'>
          <span className='suggestion-content no-icon'>
            <span className='name'>{noResultFound}</span>
          </span>
        </li>
      }
    </ul>) : (!disableAutoSearch && <ul id='suggestionList' role='listbox' className='autosuggest-suggestions-list'>
      {
        this.props.suggestions.map((s, i) => {
          return (
            <li key={`sg_${i}`} role='option'
              className='autosuggest-suggestion' onClick={() => this.getSuggestionValue.bind(this)(s)}>
              {this.props.renderSuggestion(s, this.props.input.value)}
            </li>
          );
        })
      }
    </ul>));
    return (
      <div className='autosuggest-container'>
        <input type='text'
          className={`autosuggest-input ${this.props.input.className}`}
          placeholder={placeholder}
          id={this.props.input.id}
          readOnly={this.props.input.readOnly}
          onBlur={this.handleOnBlur.bind(this)}
          onKeyPress={(e) => this.props.input.onKeyPress ? this.props.input.onKeyPress(e) : undefined}
          autoComplete='off' />
        {inputVal && <div id='autowhatever' className='autosuggest-suggestions-container'>
          {
            this.props.isServerFetching ? (!disableAutoSearch && <ul role='listbox' className='autosuggest-suggestions-list'>
              <li role='option'
                className='autosuggest-suggestion'>
                <span className='suggestion-content no-icon'>
                  <span className='name'>{fetchingMsg}</span>
                </span>
              </li>
            </ul>) : suggestions
          }
        </div>}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
AutoSuggestion.propTypes = {
  changeSuggestion: PropTypes.func,
  disableAutoSearch: PropTypes.bool,
  getSuggestionValue: PropTypes.func,
  input: PropTypes.any,
  intl: PropTypes.any,
  isServerFetching: PropTypes.bool,
  onChange: PropTypes.func,
  onInputBlur: PropTypes.func,
  onSuggestionsClearRequested: PropTypes.func,
  onSuggestionsFetchRequested: PropTypes.func,
  renderSuggestion: PropTypes.func,
  selectedValue: PropTypes.string,
  suggestions: PropTypes.any
};

export default injectIntl(AutoSuggestion);

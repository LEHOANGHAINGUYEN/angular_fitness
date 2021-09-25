import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { AutoSuggestion } from 'modules/core/components';

import './styles.scss';

export class StudioAutoSuggestion extends React.Component {
  constructor(props) {
    super(props);
    this.actions = this.props.actions;
  }

  onChange(event, newValue) {
    // Get props from Field Redux Form
    const { input: { onChange } } = this.props;

    onChange(newValue);
    this.actions.updateCurrentUser(newValue);
  }

  onSuggestionsFetchRequested(value) {
    this.actions.fetchUsersSuggestion(value);
  }

  onSuggestionsClearRequested() {
    this.actions.clearUserSuggestion();
    this.actions.clearCurrentStudio();
  }

  renderSuggestion(suggestion, query) {
    const suggestionText = `${suggestion.StudioName} #${suggestion.StudioNumber}`;
    const matches = match(suggestionText, query);
    const parts = parse(suggestionText, matches);

    return (
      <span className='suggestion-content'>
        <span className='name'>
          {parts.map((part, index) => {
            const className = part.highlight ? 'highlight' : null;
            return <span className={className} key={index}>{part.text}</span>;
          })}
        </span>
      </span>
    );
  }

  changeSuggestion(suggestion) {
    this.actions.updateCurrentStudio(suggestion);
  }

  render() {
    let value = this.props.studio;
    let suggestions = this.props.studios;
    const { meta: { touched, error } } = this.props;
    const inputProps =
      {
        id: 'studioUsername',
        className: 'i-alKeyboard',
        value,
        onKeyPress: this.props.onKeyPress,
        autoComplete: 'off',
        i18Key: 'Login.PlaceholderStudioName'
      };

    const getSuggestionValue = suggestion => `${suggestion.StudioName} #${suggestion.StudioNumber}`;
    return (
      <div className={`wrapper-studio-suggestion input-form${touched && error ? ' has-error' : ''}`}>
        <AutoSuggestion
          input={inputProps}
          onChange={this.onChange.bind(this)}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
          renderSuggestion={this.renderSuggestion.bind(this)}
          suggestions={suggestions}
          selectedValue={this.props.studio}
          getSuggestionValue={getSuggestionValue}
          onInputBlur={this.props.onInputBlur}
          isServerFetching={this.props.fetching}
          changeSuggestion={this.changeSuggestion.bind(this)}/>
        {touched && error && (<span className='text-danger-tooltip'>{error}</span>)}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
StudioAutoSuggestion.propTypes = {
  actions: PropTypes.any,
  fetching: PropTypes.bool,
  input: PropTypes.object, // The props under the input key are what connects your input component to Redux
  meta: PropTypes.object,
  onInputBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  studio: PropTypes.string,
  studios: PropTypes.array
};

export default connect(state => ({
  studios: state.auth_users.suggestions,
  studio: state.auth_users.studio,
  fetching: state.auth_users.fetching
}))(StudioAutoSuggestion);

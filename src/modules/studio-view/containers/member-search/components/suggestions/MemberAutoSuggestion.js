import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import { AutoSuggestion } from 'modules/core/components';
import { Helpers } from 'common';

import './styles.scss';

export class MemberAutoSuggestion extends React.Component {
  constructor(props) {
    super(props);
    this.actions = this.props.actions.studio_members;
    this.state = {
      member: ''
    };
  }

  onChange(event, newValue) {
    this.actions.updateCurrentMember(newValue);
    this.setState({ member: newValue });
  }

  onSuggestionsFetchRequested(value) {
    const { studio } = this.props;
    if (value) {
      this.actions.fetchMembersSuggestion(value, studio.StudioId);
    } else {
      this.actions.clearMemberSuggestion();
    }
  }

  onSuggestionsClearRequested() {
    this.actions.clearMemberSuggestion();
  }

  navigate(member) {
    this.props.actions.routing.navigateTo(`/studio/member-details/${member.MemberUUId}`);
  }

  renderSuggestion(suggestion, query) {
    const suggestionText = `${suggestion.FullName}`;
    const suggestionGenderId = suggestion.GenderId;
    const matches = match(suggestionText, query);
    const parts = parse(suggestionText, matches);
    const suggestionImg = suggestionGenderId === 1 ? 'male' : 'female';
    const displayEmail = Helpers.renderEmail(suggestion.Email);
    return (
      <div onClick={this.navigate.bind(this, suggestion)} className='no-underline'>
        <div className={`suggestion-content ${suggestionImg}`}>
          <p className='name member'>
            {parts.map((part, index) => {
              const className = part.highlight ? 'highlight' : null;
              return <span className={className} key={index}>{part.text}</span>;
            })}
          </p>
        </div>
        <p className='email'>{displayEmail}</p>
      </div>
    );
  }

  render() {
    let value = this.state.member;
    let suggestions = this.props.members;
    const inputProps = {
      id: 'autosuggestInput',
      className: 'i-alKeyboard',
      value,
      onKeyPress: this.props.onKeyPress,
      i18Key: 'MemberSearch.Input.Placeholder',
      autoComplete: 'off'
    };

    const getSuggestionValue = suggestion => suggestion.name;

    return (
      <AutoSuggestion
        disableAutoSearch={true}
        input={inputProps}
        isServerFetching={this.props.fetching}
        onChange={this.onChange.bind(this)}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
        renderSuggestion={this.renderSuggestion.bind(this)}
        suggestions={suggestions}
        selectedValue={this.props.member}
        getSuggestionValue={getSuggestionValue} />
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
MemberAutoSuggestion.propTypes = {
  actions: PropTypes.any,
  fetching: PropTypes.bool,
  member: PropTypes.any,
  members: PropTypes.any,
  onKeyPress: PropTypes.func,
  studio: PropTypes.object
};

export default connect(state => ({
  fetching: state.studio_members.fetching,
  members: state.studio_members.suggestions,
  member: state.studio_members.member,
  studio: state.auth_users.currentStudio
}))(MemberAutoSuggestion);

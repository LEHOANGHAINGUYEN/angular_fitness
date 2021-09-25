import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import * as Helpers from 'common/utils/helpers';
import { MemberAutoSuggestion, MemberResult } from './components';

import './styles.scss';

export class MemberSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      triggerSearch: false
    };
    this.search = _.debounce(this.search, 500);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.member && !_.isEqual(nextProps.member, prevState.member)) {
      return {
        showResult: true, triggerSearch: false
      };
    }
    return null;
  }
  componentWillUnmount() {
    this.props.actions.studio_members.clearMemberSuggestion();
  }

  search() {
    const { members, actions, isFetching } = this.props;

    if (members && members.length > 1 && !isFetching) {
      this.setState({ showResult: true });
    } else {
      this.setState({ triggerSearch: true });
      actions.studio_members.searchMembersSuggestion(this.props.member, this.props.studio.MboStudioId);
    }
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

  render() {
    const { intl, isFetching } = this.props;
    return (
      <div className='container'>
        <p className='label-page'>
          {intl.formatMessage({ id: 'MemberSearch.Breadcrumbs.Title' })}
        </p>
        <div className='wrapper-search-member row'>
          <div className='col-md-9'>
            <MemberAutoSuggestion actions={this.props.actions} onKeyPress={this.onKeyPress.bind(this)} />
          </div>
          <div className='col-md-3'>
            <button
              className='button-search'
              onClick={this.search.bind(this)}
              disabled={this.props.member.length > 0 ? false : true}>{intl.formatMessage({ id: 'MemberSearch.Search.Bnt' })}</button>
          </div>
        </div>
        {this.state.triggerSearch && !isFetching && this.props.members.length === 0 && this.props.member.length > 2 && (
          <div className='no-result'>
            <FormattedMessage
              id={'General.NoSuggestion.WithValue'}
              values={{
                value: (
                  <b>{this.props.member}</b>
                )
              }} /></div>
        )}
        {this.state.showResult && <div className='search-result'>
          {Helpers.getSuggestions(this.props.members, this.props.member).map((member, index) => {
            return <MemberResult
              key={index}
              member={member}
              actions={this.props.actions} />;
          })}
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
MemberSearch.propTypes = {
  actions: PropTypes.any,
  intl: intlShape.isRequired,
  isFetching: PropTypes.bool,
  member: PropTypes.any,
  members: PropTypes.any,
  studio: PropTypes.object
};

const memberSearch = connect(state => ({
  isFetching: state.studio_members.fetching,
  members: state.studio_members.members,
  member: state.studio_members.member,
  studio: state.auth_users.currentStudio
}))(MemberSearch);

export default injectIntl(memberSearch);

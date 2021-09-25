/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import './styles.scss';

/**
 * The table search component
 */
class TableSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocus: false
    };
  }

  /**
   * This trigger is invoked immediately before mounting occurs.
   * Init state values with options object that is passed from this.props
   */
  componentWillMount() {
    let searchRealTime = _.isUndefined(this.props.searchRealTime) ?
      true :
      this.props.searchRealTime;
    let fullTextSearch = _.isUndefined(this.props.fullTextSearch) ?
      true :
      this.props.fullTextSearch;

    this.setState({
      searchRealTime,
      fullTextSearch
    });
  }

  /**
   * Perform search
   */
  performSearch() {
    let keyword = this.keyword.value;

    // Perform search with this.keyword
    this.props.actions.core_table.search({
      url: this.props.baseUrl,
      params: {
        keyword,
        fullTextSearch: this.state.fullTextSearch,
        searchFields: this.props.searchFields,
        pageIndex: 1
      }
    });
  }

  /**
   * Handle key press when user press any key on search field
   * @param {any} e The event on DOM element
   */
  handleKeyPress(e) {
    if (e.key === 'Enter' && !this.state.searchRealTime) {
      this.performSearch();
    }
  }

  /**
   * Handle on search field value is changed to perform real time search
   */
  handleChange() {
    if (this.state.searchRealTime) {
      this.performSearch();
    }
  }

  /**
   * Handle on search field is focused
   */
  handleOnFocus() {
    this.setState({
      isFocus: true
    });
  }

  /**
   * Handle on search field is blur
   */
  handleOnBlur() {
    this.setState({
      isFocus: false
    });
  }

  render() {
    const { isFocus } = this.state;
    const { enableCollapse, isGlobal } = this.props;
    let className = 'table-search-input';

    // If enableCollapse is true
    if (!_.isUndefined(enableCollapse) && enableCollapse) {
      className += `${isFocus ? ' expand' : ' collapse'}`;
    }

    return (
      <input
        type='text' id='table-search'
        className={`${className} ${isGlobal ? 'global' : ''} `}
        onFocus={this.handleOnFocus.bind(this)}
        onBlur={this.handleOnBlur.bind(this)}
        onKeyPress={this.handleKeyPress.bind(this)}
        onChange={_.debounce(this.handleChange.bind(this), 500)}
        placeholder={this.props.placeholder} ref={(u) => { this.keyword = u; }} />
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
TableSearch.propTypes = {
  actions: PropTypes.any.isRequired, // The actions include common redux func (eg: show modal, etc)
  baseUrl: PropTypes.string, // Specify the end point of backend server
  enableCollapse: PropTypes.bool, // Indicate whether the search field is collapseable
  fullTextSearch: PropTypes.bool, // If the value is true, search engine just filter by first character, otherwise full text
  isGlobal: PropTypes.bool, // Specify place holder of this search field
  placeholder: PropTypes.string, // Specify list of search fields attribute
  searchFields: PropTypes.array, // Enable search real time, default value is true
  searchRealTime: PropTypes.bool
};

export default connect(state => ({
  baseUrl: state.core_table.baseUrl
}))(TableSearch);

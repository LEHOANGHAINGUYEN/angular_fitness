/**
 * Redux / React module dependency
 */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { AppConstants } from 'common';
import './styles.scss';

/**
 * LeftMenu component for corporate module
 */
export class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Render left side bar menu
   */
  renderMenu() {
    const { menuItems } = AppConstants;
    return menuItems.map((item) => this.renderMenuItem(item));
  }

  /**
   * Render menu item based on input item object
   * @param {object} item Menu item object
   */
  renderMenuItem(item) {
    return (
      <li key={item.name} className='side-bar-item'>
        <Link to={item.to} className={`link-${item.className}`} activeClassName='active'>
          <i className={item.className} />
          <span>{item.name}</span>
        </Link>
      </li>
    );
  }

  /**
   * Render to UI
   */
  render() {
    return (
      <div className='left-menu-wrapper'>
        <ul className='side-bar'>
          {this.renderMenu()}
        </ul>
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
LeftMenu.propTypes = {
  currentUser: PropTypes.object,
  routing: PropTypes.object
};

export default connect(state => ({
  routing: state.routing.locationBeforeTransitions,
  currentUser: state.auth_users.currentUser
}))(LeftMenu);

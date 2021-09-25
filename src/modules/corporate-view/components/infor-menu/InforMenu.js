/**
 * Redux / React module dependency
 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { default as Notification } from '../notification/Notification';
import { ProfileMenuItems } from './ProfileMenuItems';
import './styles.scss';
import { IconMale } from 'modules/shared/images';

/**
 * InforMenu component for corporate module
 */
export class InforMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userMenuClass: '' };
    this.isUserMenuExpand = false;
  }

  /**
   * Log out function
   */
  logout() {
    const { actions } = this.props;
    actions.auth_users.logout();
    actions.routing.navigateTo('/admin/login');
  }

  /**
   * Render profile menu item
   * @param {object} item Menu item that used to render
   */
  renderProfileMenuItem(item) {
    if (item.to) {
      return (
        <li key={item.name} className={`${item.className}`}>
          <Link to={item.to} className={'menu-item'}>{item.name}</Link>
        </li>
      );
    }

    return (
      <li key={item.name} onClick={this[item.funcName].bind(this)}>
        <a className={`${item.className} menu-item`}>
          {item.name}
        </a>
      </li>
    );
  }

  /**
   * Render infor menu for profile management
   * Ex: My Account, Log out function, etc ...
   */
  renderProfileMenu(currentUser) {
    const { FirstName, LastName, CognitoGroups } = currentUser;
    let menuItems = ProfileMenuItems.map(item => this.renderProfileMenuItem(item));

    return (
      <ul className='profile-dropdown menu'>
        <li className='profile-info row'>
          <div className='profile-image col-md-4'>
            <img className='img-circle' src={IconMale} />
          </div>
          <div className='profile-details col-md-8'>
            <h4>{`${FirstName} ${LastName}`}</h4>
            <span>{CognitoGroups ? CognitoGroups.toString() : ''}</span>
          </div>
        </li>
        {menuItems}
      </ul>
    );
  }

  userMenuClick() {
    if (this.isUserMenuExpand) { $('.user-info-wrapper').addClass('open'); } else { $('.user-info-wrapper').removeClass('open'); }
    this.isUserMenuExpand = !this.isUserMenuExpand;
  }

  /**
   * Render UI
   */
  render() {
    const { currentUser } = this.props;
    const { FirstName, LastName } = currentUser;

    return (
      <div className='infor-menu'>
        <ul className='infor-wrapper list-inline list-unstyled'>
          <Notification actions={this.props.actions} />
          <li className='user-info-wrapper ' onClick={this.userMenuClick.bind(this)}>
            <a href='#' data-toggle='dropdown' className='user-link toggle' >
              <img src={IconMale} alt='user-image' className='profile-icon img-circle img-inline' />
              <span>{`${FirstName} ${LastName}`}<i className='fa fa-caret-down left-10' /></span>
            </a>
            {this.renderProfileMenu(currentUser)}
          </li>
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
InforMenu.propTypes = {
  actions: PropTypes.any,
  currentUser: PropTypes.object,
  routing: PropTypes.object
};

export default connect(state => ({
  routing: state.routing.locationBeforeTransitions,
  currentUser: state.auth_users.currentUser
}))(InforMenu);

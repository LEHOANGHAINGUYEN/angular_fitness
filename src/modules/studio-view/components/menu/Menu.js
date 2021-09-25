import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { intlShape } from 'react-intl';
import { MenuItems } from './MenuItems';

import './styles.scss';

export class Menu extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Handle event for dropdown toggle
    // If choose target has is-collapse class -> should not close dropdown
    // Otherwise close dropdown
    const { actions, currentStudio } = this.props;
    actions.studio_setting.getMeasurementUnit(currentStudio.StudioUUId);
    $('.dropdown').on({
      click(event) {
        if (event.target.className.indexOf('is-collapse') !== -1 || event.target.closest('div').className.indexOf('is-collapse') !== -1) {
          this.closable = false;
          return;
        }
        this.closable = true;
      },
      'hide.bs.dropdown'() {
        if (!this.closable) {
          this.closable = true;
          return false;
        }

        // Hide all expanded menu
        $('.menu-collapse').collapse('hide');
        // Remove all class expanded
        $('.expanded').removeClass('expanded');
        return this.closable;
      }
    });

    // Handle collapse event
    $('.collapse').on({
      'show.bs.collapse'(event) {
        event.target.parentElement.classList.add('expanded');
      },
      'hide.bs.collapse'() {
        $('.expanded').removeClass('expanded');
      }
    });
  }
  /**
   * Log out function
   */
  logout() {
    const { actions } = this.props;

    actions.auth_users.logout();
    actions.routing.navigateTo('/login');
  }

  /**
   * Render child menus
   * @param {Array} childMenus List of child menus
   */

  renderChildMenus(childMenus) {
    const { intl } = this.props;

    return (childMenus || []).map((childMenu) => {
      if (childMenu.renderFunc) {
        return this[childMenu.renderFunc](childMenu, intl);
      }
      return (<li key={childMenu.key}>
        <Link to={childMenu.to} className={'menu-child-item'}>
          {intl.formatMessage({ id: childMenu.i18nKey })}
        </Link>
      </li>);
    });
  }

  /**
   * Render menu item
   * @param {object} item Menu item that used to render
   */
  renderMenuItem(item) {
    const { intl } = this.props;

    if (item.to) {
      return (
        <li key={item.key} className={`${item.className}`}>
          <Link to={item.to} className={'menu-item'}>
            {intl.formatMessage({ id: item.i18nKey })}
          </Link>
        </li>
      );
    }

    if (item.funcName) {
      return (
        <li key={item.key} onClick={this[item.funcName].bind(this)}>
          <a className={`${item.className} menu-item`}>
            {intl.formatMessage({ id: item.i18nKey })}
          </a>
        </li>
      );
    }

    return (
      <li key={item.key} className={`${item.className}`}>
        <a
          data-toggle='collapse'
          data-target={`#${item.key}-collapse`}
          className={'menu-item is-collapse'}>
          {intl.formatMessage({ id: item.i18nKey })}
          <i className='is-collapse fa fa-angle-right' />
        </a>
        {
          item.childMenus && (
            <ul id={`${item.key}-collapse`} className='menu-collapse collapse'>
              {this.renderChildMenus(item.childMenus)}
            </ul>
          )
        }
      </li>
    );
  }

  render() {
    let menuItems = MenuItems.map(item => this.renderMenuItem(item));
    return (
      <ul className='studio-menu dropdown-menu'>
        {menuItems}
      </ul>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Menu.propTypes = {
  actions: PropTypes.any.isRequired,
  currentStudio: PropTypes.object,
  intl: intlShape.isRequired
};

export default Menu;

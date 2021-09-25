/**
 * Redux / React module dependency
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './styles.scss';
import notifyIcon from './images/Noti.png';

/**
 * Notification component for corporate module
 */
export class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.isUserMenuExpand = false;
  }

  /**
   * This function is invoked before a mounted component receives new props
   * Ex: notifications value is changed.
   */
  componentWillReceiveProps() {
    // Do something when state is changed
  }

  userMenuClick() {
    if (this.isUserMenuExpand) {$('.notify-wrapper').addClass('open');} else {$('.notify-wrapper').removeClass('open');}
    this.isUserMenuExpand = !this.isUserMenuExpand;
  }

  userMenuBlur() {
    setTimeout(function() {
      $('.notify-wrapper').removeClass('open');
    }, 100);
    this.isUserMenuExpand = false;
  }

  render() {
    const { notifications } = this.props;
    const numNotification = notifications ? notifications.length : 0;

    return (
      <li className='notify-wrapper dropdown' onBlur={this.userMenuBlur.bind(this)} onClick={this.userMenuClick.bind(this)}>
        <a href='#' data-toggle='dropdown' className='toggle'>
          <img src={notifyIcon} alt='notification' className='notify-icon' />
          <span className='badge badge-orange'>{numNotification}</span>
        </a>
        <ul className='dropdown-menu menu'>
          <li>
            <a href='#' className='menu-item'>{`You have ${numNotification} new notifications`}</a>
          </li>
        </ul>
      </li>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Notification.propTypes = {
  actions: PropTypes.any,
  currentUser: PropTypes.object,
  notifications: PropTypes.array,
  routing: PropTypes.object
};

export default connect(state => ({
  routing: state.routing.locationBeforeTransitions,
  currentUser: state.auth_users.currentUser,
  notifications: state.auth_users.notifications
}))(Notification);

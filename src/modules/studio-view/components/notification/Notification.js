import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import moment from 'moment';

import NotificationIcon from './images/notifications-header.svg';
import './styles.scss';
import { IconMale, IconFemale } from 'modules/shared/images';

import { AppConstants } from 'common';

export class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  renderNotifications() {
    const studioNotifications = AppConstants.studioNotifications;

    return studioNotifications.map((notify, index) => {
      return (<li className={`notification-item ${!notify.isRead ? 'read' : ''}`} key={index}>
      <div className='avatar'>
        <img
          src={notify.ImageUrl === 'icon_female.svg' ? IconFemale : IconMale}
          className='profile-icon img-circle img-inline' />
      </div>
      <div className='content'>
        <p className='username'>{notify.UserName}<span className='pretty-time'>{` - ${moment(notify.DateCreated).fromNow()}`}</span></p>
        <p className='message'>{notify.Message}</p>
      </div>
    </li>);
    });
  }

  render() {
    const { intl } = this.props;
    return (
      <div className='notification-header-wrapper'>
        <div className='dropdown'>
          <a data-toggle='dropdown'><img className='notification-icon' src={NotificationIcon} /></a>
          <span className='badge badge-orange'>{1}</span>
          <ul className='dropdown-menu'>
            <li className='dropdown-title'>{intl.formatMessage({id: 'General.Notification.Title'})}</li>
            <div className='notification-content'>
              {this.renderNotifications()}
            </div>
          </ul>
        </div>
      </div>
    );
  }
}

Notification.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(Notification);

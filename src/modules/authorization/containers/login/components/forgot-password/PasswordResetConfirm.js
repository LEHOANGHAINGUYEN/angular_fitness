/**
 * React / Redux dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import EmailConfirmImage from './images/EmailConfirm.svg';

/**
 * The assets such as css, images
 */
import './styles.scss';

class PasswordResetConfirm extends React.Component {
  constructor(props) {
    super(props);
  }

  backToLogin() {
    this.props.actions.core_modal.hide();
    this.props.switchToLogin();
  }

  render() {
    return (
      <div>
        <img src={EmailConfirmImage} className='icon-email-confirm' />
        <p className='notification'>
          <FormattedMessage id={'Login.ForgotPassword.Dialog.Notification'} />
        </p>
        <button className='back-login-btn' onClick={this.backToLogin.bind(this)}>
          <FormattedMessage id={'Login.ForgotPassword.BackToLogin'} />
        </button>
      </div>
    );
  }
}

PasswordResetConfirm.propTypes = {
  actions: PropTypes.any,
  switchToLogin: PropTypes.func
};

export default PasswordResetConfirm;

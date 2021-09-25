/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Field, reduxForm } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';

import { ModalType } from 'modules/core/components/';
import { isRequired, match, isValidPassword } from 'common/utils/validation';
import PasswordResetConfirm from './PasswordResetConfirm';

/**
 * The assets such as css
 */
import './styles.scss';

class ResetPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    const { intl } = this.props;

    // Init validation function
    this.isRequired = isRequired(intl.formatMessage({ id: 'Validation.RequiredField' }));
    this.matchConfirmPassword = match('newPassword', intl.formatMessage({ id: 'Validation.MatchPassword' }));
    this.isValidPassword = isValidPassword(intl.formatMessage({ id: 'Validation.ValidPassword' }));
  }

  componentWillReceiveProps(newProps) {
    if (newProps && !newProps.email && this.props.email) {
      this.props.actions.core_modal.show({
        modalType: ModalType.Custom,
        size: 'lg',
        headerClass: 'hide-header',
        component: PasswordResetConfirm,
        props: {
          switchToLogin: this.props.switchToLogin,
          actions: this.props.actions
        },
        className: 'dialog-password-reset'
      });
    }
  }

  backToForgotPassword() {
    this.props.switchToForgotPassword();
  }

  resetPassword(values) {
    this.props.actions.auth_users.resetNewPassword(
      values.verificationCode,
      values.newPassword);
  }

  renderField({ input, type, options, meta: { touched, error } }) {
    let className = classnames({
      'check-mark': true,
      'input-form': true,
      'valid-check-mark': !error,
      'has-error': touched && error
    });

    return (
      <div className={className}>
        <input
          {...input}
          {...options}
          type={type} />
        {touched && (error && <span className='text-danger-tooltip'>{error}</span>)}
      </div>
    );
  }

  renderFormInput() {
    const { intl } = this.props;

    return (
      <div className='form-container'>
        <Field
          name='verificationCode'
          options={{
            id: 'verificationCode',
            className: 'input-temporary-password i-password',
            placeholder: intl.formatMessage({ id: 'Login.PlaceholderVerificationCode' }),
            autoComplete: 'off'
          }}
          validate={this.isRequired}
          type='input'
          component={this.renderField} />
        <Field
          name='newPassword'
          options={{
            id: 'newPassword',
            className: 'input-new-password i-password',
            placeholder: intl.formatMessage({ id: 'Login.PlaceholderNewPassword' }),
            autoComplete: 'off'
          }}
          validate={[this.isRequired, this.isValidPassword]}
          type='password'
          component={this.renderField} />
        <Field
          name='confirmPassword'
          options={{
            id: 'confirmPassword',
            className: 'input-confirm-password i-password',
            placeholder: intl.formatMessage({ id: 'Login.PlaceholderConfirmPassword' }),
            autoComplete: 'off'
          }}
          validate={[this.isRequired, this.matchConfirmPassword]}
          type='password'
          component={this.renderField} />
      </div>
    );
  }

  render() {
    const { handleSubmit, invalid, intl } = this.props;
    return (
      <form className='new-passaword-form'>
        <div className='row'>
          <i className='fa fa-lock' aria-hidden='true' />
          <h3 className='new-password'>
            {intl.formatMessage({ id: 'Login.ForgotPassword.NewPassword' })}
          </h3>
        </div>
        {this.renderFormInput()}
        <div className='col-2'>
          <button
            className='btn btn-reset-password'
            disabled={invalid}
            onClick={handleSubmit(this.resetPassword.bind(this))}>
            {intl.formatMessage({ id: 'Login.ForgotPassword.ResetPassword' })}
          </button>
        </div>
        <a className='forgot-reset-password' onClick={this.backToForgotPassword.bind(this)}>
          {intl.formatMessage({ id: 'Login.ForgotPassword.BackToForgotPassword' })}
        </a>
      </form>
    );
  }
}

ResetPasswordForm.propTypes = {
  actions: PropTypes.any,
  email: PropTypes.string,
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  switchToForgotPassword: PropTypes.func,
  switchToLogin: PropTypes.func
};

let resetPasswordForm = reduxForm({
  form: 'resetPasswordForm'
})(ResetPasswordForm);

export default injectIntl(connect(state => ({
  cognitoUser: state.auth_users.cognitoUser,
  email: state.auth_users.email
}))(resetPasswordForm));

/**
 * React / Redux dependencies
 */
import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import './styles.scss';
import { isRequired, match, isValidPassword } from 'common/utils/validation';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    const { intl } = this.props;
    // Init validation function
    this.isRequired = isRequired(intl.formatMessage({ id: 'Validation.RequiredField' }));
    this.matchConfirmPassword = match('newPassword', intl.formatMessage({ id: 'Validation.MatchPassword' }));
    this.isValidPassword = isValidPassword(intl.formatMessage({ id: 'Validation.ValidPassword' }));
  }

  componentDidMount() {
    const { username, dispatch } = this.props;

    dispatch(change('changePassword', 'cognitoUsername', username));
  }

  renderField({ input, type, options, meta: { touched, error } }) {
    return (
      <div className={`input-form${touched && error ? ' has-error' : ''}`}>
        <input
          {...input}
          {...options}
          type={type} />
        {touched && (error && <span className='text-danger-tooltip'>{error}</span>)}
      </div>
    );
  }

  renderFormInput() {
    return (
      <div className='form-container'>
        <FormattedMessage id='Login.PlaceholderUserName'>
          {ph =>
            <Field
              name='cognitoUsername'
              options={{
                id: 'cognitoUsername',
                className: 'input-username-corporate i-alKeyboard i-username',
                placeholder: ph,
                autoComplete: 'off',
                disabled: true
              }}
              component={this.renderField} />
          }
        </FormattedMessage>
        <FormattedMessage id='Login.PlaceholderCurrentPassword'>
          {ph =>
            <Field
              name='currentPassword'
              options={{
                id: 'currentPassword',
                className: 'input-password-studio i-alKeyboard i-password',
                placeholder: ph,
                autoComplete: 'off'
              }}
              type='password'
              component={this.renderField}
              validate={[this.isRequired]} />
          }
        </FormattedMessage>
        <FormattedMessage id='Login.PlaceholderNewPassword'>
          {ph =>
            <Field
              name='newPassword'
              options={{
                id: 'newPassword',
                className: 'input-password-studio i-alKeyboard i-password',
                placeholder: ph,
                autoComplete: 'off'
              }}
              type='password'
              component={this.renderField}
              validate={[this.isRequired, this.isValidPassword]} />
          }
        </FormattedMessage>
        <FormattedMessage id='Login.PlaceholderConfirmPassword'>
          {ph =>
            <Field
              name='confirmPassword'
              options={{
                id: 'confirmPassword',
                className: 'input-password-studio i-alKeyboard i-password',
                placeholder: ph,
                autoComplete: 'off'
              }}
              type='password'
              validate={[this.isRequired, this.matchConfirmPassword]}
              component={this.renderField} />
          }
        </FormattedMessage>
      </div>
    );
  }

  onSubmit(formData) {
    this.props.actions.auth_users.completeNewPassword(
      formData.cognitoUsername, formData.currentPassword, formData.newPassword
    );
  }

  backToLogin() {
    this.props.actions.auth_users.cancelForceChangePassword();
    if (this.props.switchToLogin) {
      this.props.switchToLogin();
    }
  }

  render() {
    const { handleSubmit, invalid } = this.props;

    return (
      <form className='change-password-form' onSubmit={handleSubmit(this.onSubmit.bind(this))} >
        <div className='row change-password-text'>
          <h3 className='title'><FormattedMessage id={'Login.ForceChangePassword'} /></h3>
          <p className='instruction'><FormattedMessage id={'Login.ForceChangePassword.Instruction'} /></p>
        </div>
        {this.renderFormInput()}
        <div className='col-2'>
          <button className='btn change-password-btn' disabled={invalid}>
            <FormattedMessage id='Login.ForceChangePassword' />
          </button>
        </div>
        <div className='row'><a className='back-to-login' onClick={this.backToLogin.bind(this)}><FormattedMessage id={'Login.ForgotPassword.BackToLogin'} /></a></div>
      </form>
    );
  }
}

ChangePassword.propTypes = {
  actions: PropTypes.any,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  switchToLogin: PropTypes.func,
  username: PropTypes.string
};

let changePassword = reduxForm({
  form: 'changePassword'
})(ChangePassword);

export default injectIntl(changePassword);

/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

import { isRequired, pattern } from 'common/utils/validation';
import RegexConstants from 'common/constants/regex-constants';
import ForgotPasswordImage from './images/ForgotPassword.svg';

/**
 * The assets such as css, images
 */
import './styles.scss';

class ForgotPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    const { intl } = this.props;

    this.state = {
      isSendSuccessful: false,
      isDisabled: true
    };

    // Init validation function
    this.isRequired = isRequired(intl.formatMessage({ id: 'Validation.RequiredField' }));
    this.isEmail = pattern(RegexConstants.Email, intl.formatMessage({ id: 'Validation.InvalidEmail' }));
  }

  componentWillReceiveProps(newProps) {
    if (newProps && newProps.cognitoUser !== this.props.cognitoUser) {
      this.props.switchToResetPassword();
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.auth_users.clearCognitoUser();
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

  sendEmail(values) {
    this.props.actions.auth_users.sendMailResetPassword(values.email);
  }

  renderFormInput() {
    const { invalid, intl, handleSubmit } = this.props;
    return (
      <div>
        <div className='row form-container'>
          <Field
            name='email'
            options={{
              className: 'input-email-address',
              id: 'email',
              placeholder: intl.formatMessage({ id: 'Login.ForgotPassword.PlaceholherEmailAddress' })
            }}
            validate={[this.isRequired, this.isEmail]}
            component={this.renderField} />
        </div>
        <button className='send-btn' type='button' disabled={invalid}
          onClick={handleSubmit(this.sendEmail.bind(this))}><FormattedMessage id={'Login.ForgotPassword.SendBnt'} /></button>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className='forgot-password-form' onSubmit={handleSubmit(this.sendEmail.bind(this))} >
        <div className='row forgot-image'><img src={ForgotPasswordImage} className='fp-icon' /></div>
        <div className='row forgot-text'>
          <h3 className='title'><FormattedMessage id={'Login.ForgotPassword'} /></h3>
          <p className='instruction'><FormattedMessage id={'Login.ForgotPassword.Instruction'} /></p>
        </div>
        {this.renderFormInput()}
        <div className='row'><a className='back-to-login' onClick={this.props.switchToLogin}><FormattedMessage id={'Login.ForgotPassword.BackToLogin'} /></a></div>
      </form>
    );
  }
}

ForgotPassword.propTypes = {
  actions: PropTypes.any,
  cognitoUser: PropTypes.object,
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  switchToLogin: PropTypes.func,
  switchToResetPassword: PropTypes.func,
  touch: PropTypes.func // Marks the given fields as "touched" to show errors
};

let forgotPassword = reduxForm({
  form: 'forgotPassword' // A unique identifier for this form
})(ForgotPassword);

forgotPassword = connect(state => ({
  keyboardShow: state.core_keyboard.isShow,
  cognitoUser: state.auth_users.cognitoUser
}))(forgotPassword);

forgotPassword = injectIntl(forgotPassword);

export default forgotPassword;

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
import StudioAutoSuggestion from '../suggestions/StudioAutoSuggestion';
import LoginType from './LoginType';

/**
 * The assets such as css, images
 */
import './styles.scss';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    const { intl } = this.props;

    this.state = {
      loginType: LoginType.Studio,
      type: 'password'
    };

    // Init validation function
    this.isRequired = isRequired(intl.formatMessage({ id: 'Validation.RequiredField' }));
    this.isEmail = pattern(RegexConstants.Email, intl.formatMessage({ id: 'Validation.InvalidEmail' }));
    this.showHide = this.showHide.bind(this);
  }

  /**
   * This func is invoked immediately after updating occurs
   */
  componentDidMount() {
    this.bindKeyboard();
  }

    /**
   * Trigger when receiving redux props
   */
  componentWillReceiveProps(nextProps) {
    const {change, actions} = this.props;
    if (nextProps.currentPath && nextProps.currentPath.pathname.includes('login')) {
      let mode;
      if (nextProps.currentPath.pathname === '/login') {
        mode = LoginType.Studio;
      } else if (nextProps.currentPath.pathname === '/admin/login') {
        mode = LoginType.User;
      }

      this.setState({ loginType: mode });
      change('loginType', mode);
      if (nextProps.currentPath !== this.props.currentPath) {
        actions.core_screen.clearFirstScreenLoad();
      }
    }
  }

  /**
   * This func is invoked immediately after updating occurs
   */
  componentDidUpdate() {
    this.bindKeyboard();
  }

  selectTab(name) {
    this.setState({ loginType: name });
    this.props.actions.auth_users.clearErrors();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const submitter = this.props.handleSubmit(this.props.authorize);
      submitter(); // submits
    }
  }

  bindKeyboard() {
    const self = this;
    self.props.actions.core_keyboard.setOnEnterCallback((e) => this.handleKeyPress.bind(this)(e));

    $(document).ready(() => {
      /* Temporary remove custom keyboard
      if (Helpers.mobileAndTabletCheck()) {
        // Adding change function of Form Field for Keyboard
        self.props.actions.core_keyboard.setChangeFunction(self.props.change);
        $('input.i-alKeyboard').prop('readonly', true);
        $('input.i-alKeyboard').bind('focus', function (e) {
          self.props.actions.core_keyboard.show(e);
          $(document).on('click', function (ev) {
            if (self.props.keyboardShow) {
              self.props.actions.core_keyboard.hide(ev);
            }
          });
        });
      }*/
    });
  }

  /**
   * On studio name input touch
   */
  onStudioNameInputBlur() {
    const { touch } = this.props;

    touch(...['studioUsername']);
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

  selectLanguage() {
    const { actions } = this.props;

    actions.core_language.clearLocale();
  }

  showHide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    });
  }

  /**
   * Render form input (user name and password) based on login type
   */
  renderFormInput() {
    const { loginType } = this.state;
    const checkClass = $('.wrapper-center-login').hasClass('wrapper-language');
    if (checkClass) {
      $('.wrapper-center-login').removeClass('wrapper-language');
    }
    if (loginType === LoginType.Studio) {
      return (
        <div className='form-container'>
          <Field
            name='studioUsername'
            actions={this.props.actions.auth_users}
            component={StudioAutoSuggestion}
            validate={this.isRequired}
            onInputBlur={this.onStudioNameInputBlur.bind(this)} />
          <FormattedMessage id='Login.PlaceholderStudioPassword'>
            {ph =>
              <Field
                name='studioPassword'
                options={{
                  id: 'studioPassword',
                  className: 'input-password-studio i-alKeyboard i-password',
                  placeholder: ph,
                  autoComplete: 'off'
                }}
                type={this.state.type}
                validate={this.isRequired}
                component={this.renderField} />
            }
          </FormattedMessage>
          <span
          className={`fa fa-fw fa-eye field-icon ${this.state.type === 'input' ? 'fa-eye-slash' : ''}`}
          onClick={this.showHide} />
        </div>
      );
    }
    return (
      <div className='form-container'>
        <FormattedMessage id='Login.PlaceholderUserName'>
          {ph =>
            <Field
              name='corporateUsername'
              options={{
                id: 'corporateUsername',
                className: 'input-username-corporate i-alKeyboard',
                placeholder: ph,
                autoComplete: 'off'
              }}
              type='email'
              validate={[this.isRequired, this.isEmail]}
              component={this.renderField}/>
          }
        </FormattedMessage>
        <FormattedMessage id='Login.PlaceholderPassword'>
          {ph =>
            <Field
              name='corporatePassword'
              options={{
                id: 'corporatePassword',
                className: 'input-password-corporate i-alKeyboard i-password',
                placeholder: ph,
                autoComplete: 'off'
              }}
              type={this.state.type}
              validate={this.isRequired}
              component={this.renderField} />

          }
        </FormattedMessage>
        <span
          className={`fa fa-fw fa-eye field-icon ${this.state.type === 'input' ? 'fa-eye-slash' : ''}`}
          onClick={this.showHide} />
      </div>
    );
  }

  /**
   * Validate Studio Login
   */
  validateStudioLogin() {
    const {selectedStudio, studio} = this.props;
    if (this.state.loginType !== LoginType.Studio) {
      return false;
    }

    return !selectedStudio
    || (selectedStudio && studio !== `${selectedStudio.StudioName} #${selectedStudio.StudioNumber}`);
  }

  render() {
    const { handleSubmit, invalid } = this.props;
    return (
      <form className='login-form' onSubmit={handleSubmit(this.props.authorize)} autoComplete='off'>
        <input className='fake-input' type='text' name='fakename' />
        <input className='fake-input' type='password' name='fakepass' />
        <div className='sign-in'>
          <h1> <FormattedMessage id='Login.Title' /></h1>
        </div>
        {this.renderFormInput()}
        <div className='col-2'>
          <button disabled={invalid
            || this.validateStudioLogin()}
            className='btn button-login-studio'>
            <FormattedMessage id='Login.SignInBtn' />
          </button>
        </div>
        <a className='forgot-password' onClick={this.props.switchToForgotPassword}>
          <FormattedMessage id='Login.ForgotPassword' />
        </a>
        {'/'}
        <a className='select-other-language' onClick={this.selectLanguage.bind(this)}>
          <FormattedMessage id='Login.SelectLanguage' />
        </a>
      </form>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
LoginForm.propTypes = {
  actions: PropTypes.any,
  authorize: PropTypes.func,
  change: PropTypes.func,
  currentPath: PropTypes.object,
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  loginType: PropTypes.string,
  reset: PropTypes.func,
  selectedStudio: PropTypes.object,
  studio: PropTypes.string,
  switchToForgotPassword: PropTypes.func,
  touch: PropTypes.func // Marks the given fields as "touched" to show errors
};

let loginForm = reduxForm({
  form: 'loginForm', // A unique identifier for this form
  initialValues: {
    loginType: LoginType.Studio
  }
})(LoginForm);

// Decorate with connect to read form values

loginForm = connect(state => ({
  keyboardShow: state.core_keyboard.isShow,
  currentPath: state.routing.locationBeforeTransitions,
  selectedStudio: state.auth_users.selectedStudio,
  studio: state.auth_users.studio
}))(loginForm);

loginForm = injectIntl(loginForm);

export default loginForm;

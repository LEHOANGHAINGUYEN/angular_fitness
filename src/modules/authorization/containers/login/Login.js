/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';

/**
 * The application library, component, etc...
 */
import { LanguageSetting } from 'modules/studio-view/containers';
import { LoginType, LoginForm } from './components/login-form';
import {
  ForgotPassword,
  ResetPasswordForm
} from './components/forgot-password';
import { ChangePassword } from './components/change-password';
import { ViewStates } from './ViewStates';
import LogoChallenge from './images/logo-challenge-header.png';
/**
 * The assets such as css, images
 */
import Logo from './images/Logo.png';
import './login.scss';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: ViewStates.Login
    };
  }

  componentWillReceiveProps(newProps) {
    const { actions, intl } = this.props;

    if (newProps.currentStudio && !newProps.newPasswordRequired) {
      if (this.state.loginType === LoginType.Studio) {
        actions.routing.navigateTo('/studio');
      }
    } else if (newProps.currentUser && !newProps.newPasswordRequired) {
      actions.routing.navigateTo('/corporate/coaches-hub');
    }

    if (newProps.forceChangePasswordSuccess) {
      actions.core_alert.showInfor(
        intl.formatMessage({ id: 'Login.ChangePasswordSuccess' })
      );

      setTimeout(() => {
        actions.auth_users.logout();
        this.setState({
          viewState: ViewStates.Login
        });
      }, 500);
    }

    this.props.actions.core_loading.hide();
  }

  authorize(formValues) {
    const self = this;
    const { selectedStudio } = this.props;
    this.setState(
      {
        loginType: formValues.loginType
      },
      () => {
        self.props.actions.core_loading.show();
        if (formValues.loginType === LoginType.Studio) {
          let password = formValues.studioPassword;
          self.props.actions.auth_users.loginStudio(selectedStudio, password);
        } else if (formValues.loginType === LoginType.User) {
          let username = formValues.corporateUsername;
          let password = formValues.corporatePassword;
          self.props.actions.auth_users.loginUser(username, password);
        }
      }
    );
  }

  switchViewState(viewState) {
    this.setState({ viewState });
  }

  renderView() {
    const { actions, isSwitchLocale, email, newPasswordRequired } = this.props;
    const { viewState } = this.state;
    if (!isSwitchLocale) {
      $('.wrapper-center-login').addClass('wrapper-language');
      return (
        <div>
          <div className='header-title'>
            <img src={LogoChallenge} />
            <span className='title'>
              <FormattedMessage id='General.AppName' />
            </span>
          </div>
          <LanguageSetting actions={actions} />
        </div>
      );
    }

    if (newPasswordRequired) {
      return (
        <ChangePassword
          actions={this.props.actions}
          username={email}
          switchToLogin={this.switchViewState.bind(this, ViewStates.Login)} />
      );
    }

    if (viewState === ViewStates.ForgotPassword) {
      return (
        <ForgotPassword
          actions={this.props.actions}
          switchToResetPassword={this.switchViewState.bind(
            this,
            ViewStates.ResetPassword
          )}
          switchToLogin={this.switchViewState.bind(this, ViewStates.Login)} />
      );
    }

    if (viewState === ViewStates.ResetPassword) {
      return (
        <ResetPasswordForm
          actions={this.props.actions}
          switchToLogin={this.switchViewState.bind(this, ViewStates.Login)}
          switchToForgotPassword={this.switchViewState.bind(
            this,
            ViewStates.ForgotPassword
          )} />
      );
    }

    return (
      <LoginForm
        actions={this.props.actions}
        authorize={this.authorize.bind(this)}
        switchToForgotPassword={this.switchViewState.bind(
          this,
          ViewStates.ForgotPassword
        )} />
    );
  }

  render() {
    const { isSwitchLocale } = this.props;
    return (
      <div className={'wrapper-center-login  wrapper-language'}>
        {isSwitchLocale ? (
          <div className='header-logo'>
            <img src={Logo} className='logo-web' />
            <div className='inclined-line' />
            <div className='fitness-challenge-application'>
              <FormattedMessage id='General.AppName' />
            </div>
          </div>
        ) : null}
        {this.renderView()}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
Login.propTypes = {
  actions: PropTypes.any,
  currentStudio: PropTypes.object,
  currentUser: PropTypes.object,
  email: PropTypes.string,
  intl: intlShape.isRequired,
  isSwitchLocale: PropTypes.bool,
  locale: PropTypes.string,
  newPasswordRequired: PropTypes.bool,
  selectedStudio: PropTypes.object,
  studio: PropTypes.string
};

let login = connect(state => ({
  locale: state.core_language.locale,
  error: state.core_errorHandler.error,
  email: state.auth_users.email,
  currentStudio: state.auth_users.currentStudio,
  currentUser: state.auth_users.currentUser,
  isSwitchLocale: state.core_language.isSwitched,
  newPasswordRequired: state.auth_users.newPasswordRequired,
  studio: state.auth_users.studio,
  errors: state.auth_users.errors,
  forceChangePasswordSuccess: state.auth_users.forceChangePasswordSuccess,
  selectedStudio: state.auth_users.selectedStudio
}))(Login);

login = injectIntl(login);

export default login;

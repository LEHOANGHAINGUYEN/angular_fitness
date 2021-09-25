/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import { AlertType } from './AlertType';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
// Customize css
import './styles.scss';

/**
 * Using react-s-alert for this implementation
 * Reference to: https://github.com/juliancwirko/react-s-alert
 */
export class AlertRedux extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Trigger after route is changed, close all current showing alert/notification
    this.props.history.listen(() => {
      this.closeAllAlert();
    });
  }

  componentDidUpdate() {
    const { alertType, message } = this.props;

    switch (alertType) {
      case AlertType.Error:
        this.showError(message || 'Something wrong happened!');
        break;
      case AlertType.Info:
        this.showInfor(message || 'Information!');
        break;
      default:
        this.closeAllAlert();
        break;
    }
  }

  /**
   * Close all alert
   */
  closeAllAlert() {
    Alert.closeAll();
  }

  /**
   * Show information notification
   */
  showInfor(inforMessage) {
    Alert.info(inforMessage, {
      onClose: this.handleOnAlertClose.bind(this)
    });
  }

  /**
   * Show error notification
   */
  showError(errorMessage) {
    Alert.error(errorMessage, {
      onClose: this.handleOnErrorAlertClose.bind(this)
    });
  }

  /**
   * Handle on error alert close
   */
  handleOnErrorAlertClose() {
    const { actions } = this.props;

    actions.core_errorHandler.destroyError();
    actions.core_alert.destroyAlert();
  }

  /**
   * Handle on alert close
   */
  handleOnAlertClose() {
    const { actions } = this.props;

    actions.core_alert.destroyAlert();
  }

  render() {
    return (
      <Alert
        effect='slide'
        stack={true}
        position='top-right'
        timeout={5000} />
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
AlertRedux.propTypes = {
  actions: PropTypes.any,
  alertType: PropTypes.string,
  history: PropTypes.any,
  message: PropTypes.string
};

export default connect(state => ({
  alertType: state.core_alert.alertType,
  message: state.core_alert.message
}))(AlertRedux);

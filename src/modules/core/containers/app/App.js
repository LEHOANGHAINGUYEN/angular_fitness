import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router';
import { connect, Provider } from 'react-redux';
import moment from 'moment';

import {
  SplashScreen,
  LoadingIndicator,
  Modal,
  ErrorHandler,
  Alert,
  AlphaNumericKeyboard
} from 'modules/core/components';
import { messages } from 'localization';

import { LanguageProvider } from '..';

import './app.scss';

class App extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    const self = this;

    $('body').css({ overflow: 'visible' });
    setTimeout(() => {
      actions.core_splash.hide(2000);
      setTimeout(() => {
        $('.page-in').css({ animation: 'unset', opacity: 1 });
      }, 4100);
    }, 2000);
    $(document).on('click', function () {
      if (self.canExpandSreen()) {
        actions.core_screen.firstScreenLoad();
        actions.core_screen.expand();
      }
    });
    this.interval = setInterval(() => {
      if (moment(new Date()).format('h:mm:ss A') === '2:00:00 AM') {
        window.location.reload(true);
      }
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  canExpandSreen() {
    return window.innerHeight !== screen.height && !this.props.firstScreenLoad;
  }

  get content() {
    const { history, routes, routerKey, actions } = this.props;
    let newProps = {
      actions,
      ...this.props
    };

    const createElement = (Component, props) => {
      return <Component {...newProps} {...props} />;
    };

    return (
      <Router
        key={routerKey}
        routes={routes}
        createElement={createElement}
        history={history} />
    );
  }

  renderAppContent() {
    const { showSplash } = this.props;

    return !showSplash && (
      <div className={`orange-app-container${showSplash ? '' : ' page-in'}`}>
        {this.content}
        <Modal actions={this.props.actions} />
        <Alert history={this.props.history} actions={this.props.actions} />
        <ErrorHandler actions={this.props.actions} />
        <LoadingIndicator />
        <AlphaNumericKeyboard actions={this.props.actions} alignment='bottom' />
      </div>
    );
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <LanguageProvider messages={messages}>
          <div>
            {this.renderAppContent()}
            <SplashScreen />
          </div>
        </LanguageProvider>
      </Provider>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object,
  firstScreenLoad: PropTypes.bool,
  history: PropTypes.object.isRequired,
  router: PropTypes.object,
  routerKey: PropTypes.number,
  routes: PropTypes.element.isRequired,
  showSplash: PropTypes.bool,
  store: PropTypes.any
};

export default connect(state => ({
  showSplash: state.core_splash.isShow,
  firstScreenLoad: state.core_screen.firstScreenLoad
}))(App);

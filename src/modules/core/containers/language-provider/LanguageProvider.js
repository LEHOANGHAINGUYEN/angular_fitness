/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import moment from 'moment';
import * as _ from 'lodash';

// If locale isn't selected by user using browser locale default
import { locale as defaultLocale } from 'localization';

export class LanguageProvider extends React.Component {
  render() {
    const { children, locale, messages } = this.props;
    let localeSession = locale;

    if (!locale || _.isNull(locale) || _.isEqual(locale, 'null')) {
      localeSession = defaultLocale;
    }

    moment.locale(localeSession);

    return (
      <IntlProvider
        locale={localeSession}
        key={localeSession}
        messages={messages[localeSession]}>
        {children}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.string,
  messages: PropTypes.object
};

export default connect(state => ({
  locale: state.core_language.locale
}))(LanguageProvider);

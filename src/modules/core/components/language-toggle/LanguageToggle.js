/**
 * React / Redux dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Locales } from './Locales';

import './styles.scss';

/**
 * Language toggle component
 */
export class LanguageToggle extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Change locale
   */
  changeLocale(nextLocale) {
    const { actions, onSelectLanguage } = this.props;

    actions.core_language.changeLocale(nextLocale);

    if (typeof onSelectLanguage === 'function') {
      onSelectLanguage(nextLocale);
    }
  }

  /**
   * Render language options
   */
  renderLanguageOptions() {
    const { locale } = this.props;

    return Locales.map(item => {
      return (
        <div
          key={item.value}
          className={`language-option${item.value === locale ? ' selected' : ''}`}>
          <img
            onClick={this.changeLocale.bind(this, item.value)}
            className={item.className} />
          {item.label}
        </div>
      );
    });
  }

  render() {
    const { className } = this.props;

    return (
      <div className={`language-toggle${className ? ` ${className}` : ''}`}>
        {this.renderLanguageOptions()}
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
LanguageToggle.propTypes = {
  actions: PropTypes.any.isRequired,
  className: PropTypes.string,
  locale: PropTypes.string,
  onSelectLanguage: PropTypes.func
};

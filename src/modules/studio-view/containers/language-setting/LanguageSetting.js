import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';

import { FormSelect } from 'modules/core/components';
import { Constants } from 'common';
import './styles.scss';

export function LanguageSetting({ locale, intl, actions, onSelectLanguage }) {
  const handleChange = (e) => {
    actions.core_language.changeLocale(e.value);
    if (typeof onSelectLanguage === 'function') {
      onSelectLanguage(e.value);
    }
    const checkClass = $('.wrapper-center-login').hasClass('wrapper-language');
    if (checkClass) {
      $('.wrapper-center-login').removeClass('wrapper-language');
    }
  };
  return (
    <div className='language-setting-wrapper'>
      <p className='label-page'>
        {intl.formatMessage({ id: 'Language.Setting.Title' })}
      </p>
      <div className='dropdown'>
        <FormSelect
          async={false}
          className='select-language'
          searchable={false}
          options={Constants.languageConfig.default.languages}
          value={locale}
          onChange={handleChange.bind(this)} />
      </div>
    </div>
  );
}
LanguageSetting.propTypes = {
  actions: PropTypes.any,
  intl: intlShape.isRequired,
  locale: PropTypes.string,
  onSelectLanguage: PropTypes.func
};

const languageSetting = connect(state => ({
  locale: state.core_language.locale
}))(LanguageSetting);

export default injectIntl(languageSetting);

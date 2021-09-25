import { addLocaleData } from 'react-intl';
import moment from 'moment';

/* Locales data */
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import ca from 'react-intl/locale-data/ca';
import es from 'react-intl/locale-data/es';
import ja from 'react-intl/locale-data/ja';
/* We have to add others lang support manually here */

// Helper library to get query URL language parameter
import * as Helper from 'common/utils/helpers';

addLocaleData([...en, ...fr, ...ca, ...es, ...ja]);

import enLocaleData from './en.json';
import frLocaleData from './fr.json';
import esLocaleData from './es.json';
import jaLocaleData from './ja.json';

export const messages = {
  en: enLocaleData,
  fr: frLocaleData,
  es: esLocaleData,
  ja: jaLocaleData
};

export let locale = (navigator.language ||
  navigator.languages && navigator.languages[0]) ||
  navigator.userLanguage;

// If query param that get from URL has value ('lang' query parameter) using it\
const langQuery = Helper.getUrlVars();

if (langQuery.lang && messages[langQuery.lang]) {
  locale = langQuery.lang;
}

// Split locales with a region code
locale = locale.toLowerCase().split(/[_-]+/)[0];

// Switch global locale for moment library
moment.locale(locale);

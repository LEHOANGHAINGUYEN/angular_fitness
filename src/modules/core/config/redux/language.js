import { createConstants, createReducer } from 'redux-module-builder';
import * as _ from 'lodash';

import { LocaleSessionConstant } from 'common/constants/constants';

export const types = createConstants('language')('CHANGE_LOCALE', 'CLEAR_LOCALE');

export const actions = {
  changeLocale: (nextLocale) => (dispatch) => {
    dispatch({ type: types.CHANGE_LOCALE, payload: { locale: nextLocale } });
    // Store session for nextLocale
    localStorage.setItem(LocaleSessionConstant, nextLocale);
  },
  clearLocale: () => (dispatch) => {
    dispatch({ type: types.CLEAR_LOCALE });
  }
};

export const reducer = createReducer({
  [types.CHANGE_LOCALE]: (state, { payload }) => {
    return {
      ...state,
      locale: payload.locale,
      isSwitched: true
    };
  },
  [types.CLEAR_LOCALE]: (state) => {
    return {
      ...state,
      isSwitched: false
    };
  }
});

const localeSession = localStorage.getItem(LocaleSessionConstant);
const locale = localeSession && !_.isNull(localeSession) && !_.isEqual(localeSession, 'null')
  ? localStorage.getItem(LocaleSessionConstant) : 'en';

export const initialState = {
  locale,
  isSwitched: !_.isNull(localStorage.getItem(LocaleSessionConstant))
};

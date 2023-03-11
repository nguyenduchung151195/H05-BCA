/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
// const enTranslationMessages = require('./translations/en.js');
// import en from './translations/en';

const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
const viLocaleData = require('react-intl/locale-data/vi');
const viTranslationMessages = require('./translations/vi.json');
addLocaleData(viLocaleData);

const DEFAULT_LOCALE = 'vi';

// prettier-ignore
const appLocales = [
  'vi',
];

const appLocalesDetail = [
  {
    id: 'vi',
    title: 'Tiếng Việt',
  },
];

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, JSON.stringify(enTranslationMessages)) : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE ? defaultFormattedMessages[key] : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMessages = {
  vi: formatTranslationMessages('vi', viTranslationMessages),
};

// module.exports.appLocales = appLocales;
// module.exports.appLocalesDetail = appLocalesDetail;
// module.exports.formatTranslationMessages = formatTranslationMessages;
// module.exports.translationMessages = translationMessages;
// module.exports.DEFAULT_LOCALE = DEFAULT_LOCALE;
module.exports = {
  appLocales,
  appLocalesDetail,
  formatTranslationMessages,
  translationMessages,
  DEFAULT_LOCALE,
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './public/locales/en/common.json';
import he from './public/locales/he/common.json';
import ru from './public/locales/ru/common.json';
import fr from './public/locales/fr/common.json';
import it from './public/locales/it/common.json';
import es from './public/locales/es/common.json';

const resources = {
  en: { common: en },
  he: { common: he },
  ru: { common: ru },
  fr: { common: fr },
  it: { common: it },
  es: { common: es },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n; 
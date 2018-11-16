import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

import languageDetector from './languageDetector'
import translationEN from './language/EN/translation.json'
import translationDE from './language/DE/translation.json'
import translationES from './language/ES/translation.json'
import translationRU from './language/RU/translation.json'

const resources = {
    en: {
        translation: translationEN
    },
    de: {
        translation: translationDE
    },
    es: {
        translation: translationES
    },
    ru: {
        translation: translationRU
    }
};


i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init(
    {
    resources,
    fallbackLng: "en",
    
    keySeparator: false,

    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;
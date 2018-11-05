import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

import translationEN from './language/EN/translation.json'
import translationDE from './language/DE/translation.json'

const resources = {
    en: {
        translation: translationEN
    },
    de: {
        translation: translationDE
    }
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    
    keySeparator: false,

    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;
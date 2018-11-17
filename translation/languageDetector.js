import Expo from 'expo';

const AsyncStorage = require('react-native').AsyncStorage;

const languageDetector = {
  name: 'myDetector',
  type: 'languageDetector',
  async: true,
  async detect(callback) {
    AsyncStorage.getItem('@i18next-async-storage/user-language')
      .then((language) => {
        if (language) {
          return callback(language.split('_')[0]);
        }
        if (Expo.Constants.platform.android === undefined) {
          return Expo.DangerZone.Localization
            .getCurrentLocaleAsync()
            .then((lng) => { callback(lng.split('_')[0]); });
        }
        return callback('en');
      });
  },
  init: () => {},
  cacheUserLanguage(language) {
    AsyncStorage.setItem('@i18next-async-storage/user-language', language);
  },
};

export default languageDetector;

import Expo from "expo";

const languageDetector = {
    name: 'myDetector',
    type: 'languageDetector',
    async: true,
    detect: (callback) => {
        return Expo.DangerZone.Localization
            .getCurrentLocaleAsync()
            .then((lng) => { callback(lng.split('_')[0]); })
    },
    init: () => {},
    cacheUserLanguage: () => {},
};

export default languageDetector;

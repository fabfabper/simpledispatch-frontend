import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Initialize i18next with empty resources
// Translations will be loaded dynamically from the API
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {} },
    de: { translation: {} },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Load translations from API and update i18next resources
 * @param {Object} translations - Translations object with language codes as keys
 */
export const loadTranslationsIntoI18n = (translations) => {
  Object.keys(translations).forEach((language) => {
    i18n.addResourceBundle(
      language,
      "translation",
      translations[language],
      true,
      true
    );
  });
};

export default i18n;

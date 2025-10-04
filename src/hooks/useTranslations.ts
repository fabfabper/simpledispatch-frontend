// useTranslations.ts
// Custom hook for managing translations

import { useTranslationStore } from "../utils/translationStore";

/**
 * Custom hook that provides translation functionality
 * This can be used alongside react-i18next's useTranslation hook
 */
export const useTranslations = () => {
  const {
    translations,
    currentLanguage,
    isLoading,
    error,
    setCurrentLanguage,
    loadTranslations,
    getTranslation,
  } = useTranslationStore();

  return {
    translations,
    currentLanguage,
    isLoading,
    error,
    setCurrentLanguage,
    loadTranslations,
    getTranslation,
    // Convenience method to check if translations are loaded
    isReady: !isLoading && Object.keys(translations).length > 0,
    // Convenience method to get available languages
    availableLanguages: Object.keys(translations),
  };
};

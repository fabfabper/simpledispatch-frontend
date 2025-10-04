// translationApi.ts
// Service for handling translation API requests

export interface TranslationData {
  [key: string]: string;
}

export interface TranslationsResponse {
  [language: string]: TranslationData;
}

/**
 * Fetch translations from the external API
 * @param language - The language code (e.g., 'en', 'de')
 * @returns Promise with translation data for the specified language
 */
export async function fetchTranslations(
  language: string
): Promise<TranslationData> {
  try {
    const response = await fetch(`/api/translations/${language}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const translations: TranslationData = await response.json();
    return translations;
  } catch (error) {
    console.error("Translation API error:", error);
    throw new Error(
      `Failed to fetch translations for ${language}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Fetch all available translations for multiple languages
 * @param languages - Array of language codes to fetch
 * @returns Promise with translations for all specified languages
 */
export async function fetchAllTranslations(
  languages: string[]
): Promise<TranslationsResponse> {
  try {
    const translationPromises = languages.map(async (lang) => {
      const translations = await fetchTranslations(lang);
      return { language: lang, translations };
    });

    const results = await Promise.all(translationPromises);

    const allTranslations: TranslationsResponse = {};
    results.forEach(({ language, translations }) => {
      allTranslations[language] = translations;
    });

    return allTranslations;
  } catch (error) {
    console.error("Error fetching all translations:", error);
    throw error;
  }
}

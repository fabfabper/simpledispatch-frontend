// translationStore.ts
// Zustand store for managing translations

import { create } from "zustand";
import {
  fetchAllTranslations,
  type TranslationData,
  type TranslationsResponse,
} from "../services/translationApi";

interface TranslationState {
  translations: TranslationsResponse;
  currentLanguage: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentLanguage: (language: string) => void;
  loadTranslations: (languages: string[]) => Promise<void>;
  getTranslation: (key: string, language?: string) => string;
  setTranslations: (translations: TranslationsResponse) => void;
  setError: (error: string | null) => void;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  translations: {},
  currentLanguage: "en", // Default language
  isLoading: false,
  error: null,

  setCurrentLanguage: (language: string) => {
    set({ currentLanguage: language });
  },

  loadTranslations: async (languages: string[]) => {
    set({ isLoading: true, error: null });

    try {
      const translations = await fetchAllTranslations(languages);
      set({ translations, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load translations";
      set({ error: errorMessage, isLoading: false });
      console.error("Translation loading error:", error);
    }
  },

  getTranslation: (key: string, language?: string) => {
    const state = get();
    const lang = language || state.currentLanguage;
    const langTranslations = state.translations[lang];

    if (!langTranslations) {
      console.warn(`No translations found for language: ${lang}`);
      return key; // Return the key as fallback
    }

    return langTranslations[key] || key; // Return the key as fallback if translation not found
  },

  setTranslations: (translations: TranslationsResponse) => {
    set({ translations });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

// configurationStore.ts
// Zustand store for managing application configurations

import { create } from "zustand";
import {
  fetchConfigurations,
  fetchUnitStatuses,
  type Configuration,
  type UnitStatus,
} from "../services/configurationApi";

interface ConfigurationState {
  configuration: Configuration | null;
  unitStatuses: UnitStatus[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  loadConfigurations: () => Promise<void>;
  setConfiguration: (configuration: Configuration) => void;
  setUnitStatuses: (unitStatuses: UnitStatus[]) => void;
  getUnitStatusById: (id: number) => UnitStatus | undefined;
  getUnitStatusByLabel: (label: string) => UnitStatus | undefined;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useConfigurationStore = create<ConfigurationState>((set, get) => ({
  configuration: null,
  unitStatuses: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  loadConfigurations: async () => {
    set({ isLoading: true, error: null });

    try {
      // Fetch unit statuses directly from the specific endpoint
      const unitStatuses = await fetchUnitStatuses();

      // Create a basic configuration object
      const configuration: Configuration = {
        unitStatuses,
      };

      set({
        configuration,
        unitStatuses,
        isLoading: false,
        isInitialized: true,
      });
      console.log("Configurations loaded successfully:", { unitStatuses });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load configurations";
      set({
        error: errorMessage,
        isLoading: false,
        isInitialized: true, // Set to true even on error to avoid infinite loading
      });
      console.error("Configuration loading error:", error);
    }
  },

  setConfiguration: (configuration: Configuration) => {
    set({
      configuration,
      unitStatuses: configuration.unitStatuses || [],
    });
  },

  setUnitStatuses: (unitStatuses: UnitStatus[]) => {
    set({ unitStatuses });
  },

  getUnitStatusById: (id: number) => {
    const state = get();
    return state.unitStatuses.find((status) => status.id === id);
  },

  getUnitStatusByLabel: (label: string) => {
    const state = get();
    return state.unitStatuses.find(
      (status) => status.label.toLowerCase() === label.toLowerCase()
    );
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

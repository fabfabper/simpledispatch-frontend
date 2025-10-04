// useConfigurations.ts
// Custom hook for accessing configuration data

import { useConfigurationStore } from "../utils/configurationStore";

/**
 * Custom hook that provides easy access to configuration data
 */
export const useConfigurations = () => {
  const {
    configuration,
    unitStatuses,
    isLoading,
    error,
    isInitialized,
    getUnitStatusById,
    getUnitStatusByLabel,
    loadConfigurations,
  } = useConfigurationStore();

  return {
    // Configuration data
    configuration,
    unitStatuses,

    // State
    isLoading,
    error,
    isInitialized,
    isReady: isInitialized && !isLoading && !error,

    // Helper functions
    getUnitStatusById,
    getUnitStatusByLabel,

    // Actions
    loadConfigurations,

    // Convenience methods
    getUnitStatusColor: (statusId: number | string) => {
      const numericId =
        typeof statusId === "string" ? parseInt(statusId, 10) : statusId;
      const status = getUnitStatusById(numericId);
      return status?.color || "#6b7280";
    },

    getUnitStatusLabel: (statusId: number | string) => {
      const numericId =
        typeof statusId === "string" ? parseInt(statusId, 10) : statusId;
      const status = getUnitStatusById(numericId);
      return status?.label || `Status ${numericId}`;
    },

    hasConfiguration: () => configuration !== null && unitStatuses.length > 0,
  };
};

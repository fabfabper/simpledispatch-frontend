// configurationUtils.ts
// Utility functions for working with configurations

import { useConfigurationStore } from "./configurationStore";

/**
 * Get unit status color by status ID
 * Fallback to hardcoded colors if configurations are not loaded
 */
export const getUnitStatusColor = (statusId: number | string): string => {
  const { unitStatuses, isInitialized } = useConfigurationStore.getState();
  const numericId =
    typeof statusId === "string" ? parseInt(statusId, 10) : statusId;

  if (isInitialized && unitStatuses.length > 0) {
    const status = unitStatuses.find((s) => s.id === numericId);
    if (status) {
      return status.color;
    }
  }

  // Fallback to hardcoded colors if configuration is not available
  const fallbackColors: { [key: string]: string } = {
    "0": "#22c55e", // green
    "1": "#facc15", // yellow
    "2": "#ef4444", // red
    "3": "#3b82f6", // blue
    "4": "#a3a3a3", // gray
  };

  return fallbackColors[String(numericId)] || "#6b7280"; // Default gray
};

/**
 * Get unit status label by status ID
 */
export const getUnitStatusLabel = (statusId: number | string): string => {
  const { unitStatuses, isInitialized } = useConfigurationStore.getState();
  const numericId =
    typeof statusId === "string" ? parseInt(statusId, 10) : statusId;

  if (isInitialized && unitStatuses.length > 0) {
    const status = unitStatuses.find((s) => s.id === numericId);
    if (status) {
      return status.label;
    }
  }

  // Fallback to status ID if configuration is not available
  return `Status ${numericId}`;
};

/**
 * Get all available unit statuses
 */
export const getUnitStatuses = () => {
  const { unitStatuses, isInitialized } = useConfigurationStore.getState();

  if (isInitialized && unitStatuses.length > 0) {
    return unitStatuses;
  }

  // Fallback to hardcoded statuses if configuration is not available
  return [
    { id: 0, label: "Available", color: "#22c55e" },
    { id: 1, label: "Busy", color: "#facc15" },
    { id: 2, label: "Unavailable", color: "#ef4444" },
    { id: 3, label: "In Transit", color: "#3b82f6" },
    { id: 4, label: "On Standby", color: "#a3a3a3" },
  ];
};

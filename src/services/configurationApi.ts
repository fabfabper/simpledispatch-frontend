// configurationApi.ts
// Service for handling configuration API requests

export interface UnitStatus {
  id: number;
  label: string;
  color: string;
}

export interface Configuration {
  unitStatuses: UnitStatus[];
  // Add other configuration types here as needed
  eventTypes?: string[];
  mapSettings?: {
    defaultZoom: number;
    defaultCenter: [number, number];
  };
}

/**
 * Fetch all configurations from the external API
 * @returns Promise with configuration data
 */
export async function fetchConfigurations(): Promise<Configuration> {
  try {
    const response = await fetch("/api/configurations");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const configuration: Configuration = await response.json();
    return configuration;
  } catch (error) {
    console.error("Configuration API error:", error);
    throw new Error(
      `Failed to fetch configurations: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Fetch specific configuration section
 * @param section - The configuration section to fetch (e.g., 'unitStatuses', 'eventTypes')
 * @returns Promise with specific configuration data
 */
export async function fetchConfigurationSection<T>(
  section: string
): Promise<T> {
  try {
    const response = await fetch(`/api/configurations/${section}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`Configuration API error for section ${section}:`, error);
    throw new Error(
      `Failed to fetch ${section} configuration: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Fetch unit statuses configuration
 * @returns Promise with unit statuses array
 */
export async function fetchUnitStatuses(): Promise<UnitStatus[]> {
  return fetchConfigurationSection<UnitStatus[]>("unitstatus");
}

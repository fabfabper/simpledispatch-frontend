// geoApi.ts
// Service for handling geocoding API requests

import type { AutocompleteSuggestion } from "@fabfabper/simpledispatch-shared-models/typescript/AutocompleteSuggestion";

export interface GeoApiResponse {
  results?: AutocompleteSuggestion[];
  // Handle different response formats
  [key: string]: any;
}

/**
 * Search for locations using the geocoding autocomplete API
 * @param searchText - The text to search for
 * @param size - Maximum number of results (default: 5)
 * @returns Promise with array of location results
 */
export async function searchLocations(
  searchText: string,
  size: number = 5
): Promise<AutocompleteSuggestion[]> {
  if (!searchText || searchText.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `/api/geoservice/autocomplete?text=${encodeURIComponent(
        searchText
      )}&size=${size}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeoApiResponse = await response.json();

    // Debug: Log the response structure
    console.log("Geocoding API response:", data);

    // Handle different response formats
    if (Array.isArray(data)) {
      const results = data as AutocompleteSuggestion[];
      console.log("Array response, first item:", results[0]);
      return results;
    } else if (data.results && Array.isArray(data.results)) {
      console.log("Results array, first item:", data.results[0]);
      return data.results;
    } else if (typeof data === "object" && data !== null) {
      // If it's a single object, wrap it in an array
      console.log("Single object response:", data);
      return [data as AutocompleteSuggestion];
    }

    return [];
  } catch (error) {
    console.error("Geocoding API error:", error);
    throw new Error(
      `Failed to search locations: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Extract coordinates from a location result
 * @param location - The location result object
 * @returns Object with lat and lng, or null if not available
 */
export function extractCoordinates(
  location: AutocompleteSuggestion
): { lat: number; lng: number } | null {
  const lat = location.latitude;
  const lng = location.longitude;

  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
  }

  return null;
}

/**
 * Get display name for a location result
 * @param location - The location result object
 * @returns The best available display name
 */
export function getLocationDisplayName(
  location: AutocompleteSuggestion
): string {
  console.log("getLocationDisplayName called with:", location);
  // If label is available and not empty, use it
  if (location.label && location.label.trim()) {
    return location.label;
  }

  // Otherwise, construct a name from available parts
  const parts = [location.city, location.region, location.country]
    .filter((part) => part && part.trim())
    .join(", ");

  return parts || "Unknown location";
}

// api.ts
// HTTP request functions for events and units

import {
  EventApiResponse,
  Event,
} from "@fabfabper/simpledispatch-shared-models/typescript/EventApiResponse";
import {
  UnitApiResponse,
  Unit,
} from "@fabfabper/simpledispatch-shared-models/typescript/UnitApiResponse";

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch("http://localhost:5035/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");

  const responseData = await res.json();

  // Check if response is an EventApiResponse format
  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData
  ) {
    const eventApiResponse: EventApiResponse = responseData;

    if (eventApiResponse.success && eventApiResponse.data) {
      // Check if data is an array or single event
      if (Array.isArray(eventApiResponse.data)) {
        return eventApiResponse.data;
      } else {
        // Single event wrapped in ApiResponse
        return [eventApiResponse.data];
      }
    } else {
      throw new Error(
        eventApiResponse.error ||
          eventApiResponse.message ||
          "Failed to fetch events"
      );
    }
  } else {
    // Assume response is directly an array of events or single event
    if (Array.isArray(responseData)) {
      return responseData as Event[];
    } else if (responseData) {
      return [responseData as Event];
    } else {
      throw new Error("No event data received");
    }
  }
}

export async function fetchUnits(): Promise<Unit[]> {
  const res = await fetch("http://localhost:5035/api/units");
  if (!res.ok) throw new Error("Failed to fetch units");

  const responseData = await res.json();

  // Check if response is a UnitApiResponse format
  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData
  ) {
    const unitApiResponse: UnitApiResponse = responseData;

    if (unitApiResponse.success && unitApiResponse.data) {
      // Check if data is an array or single unit
      if (Array.isArray(unitApiResponse.data)) {
        return unitApiResponse.data;
      } else {
        // Single unit wrapped in ApiResponse
        return [unitApiResponse.data];
      }
    } else {
      throw new Error(
        unitApiResponse.error ||
          unitApiResponse.message ||
          "Failed to fetch units"
      );
    }
  } else {
    // Assume response is directly an array of units or single unit
    if (Array.isArray(responseData)) {
      return responseData as Unit[];
    } else if (responseData) {
      return [responseData as Unit];
    } else {
      throw new Error("No unit data received");
    }
  }
}

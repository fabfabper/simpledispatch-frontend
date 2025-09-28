// Update a unit by ID
export async function updateUnitApi(
  id: string,
  unit: Partial<Unit>
): Promise<Unit> {
  console.log("API - updateUnitApi called with ID:", id);
  console.log("API - updateUnitApi called with unit:", unit);
  console.log("API - JSON payload being sent:", JSON.stringify(unit, null, 2));

  const res = await fetch(`http://localhost:5035/api/units/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(unit),
  });

  console.log("API - Response status:", res.status);
  console.log("API - Response ok:", res.ok);

  if (!res.ok) {
    const errorText = await res.text();
    console.log("API - Error response text:", errorText);
    throw new Error(`Failed to update unit: ${res.status} ${errorText}`);
  }

  // Check if response has content
  const contentLength = res.headers.get("content-length");
  console.log("API - Content-Length:", contentLength);

  // If response is empty (common for PUT operations), return the updated unit
  if (contentLength === "0" || res.status === 204) {
    console.log("API - Empty response, returning updated unit data");
    return unit as Unit; // Return the unit we sent (assuming it was accepted)
  }

  let responseData;
  try {
    responseData = await res.json();
    console.log("API - Response data:", responseData);
  } catch (jsonError) {
    console.error("API - JSON parse error:", jsonError);
    // Check if response is actually empty
    const rawText = await res.clone().text();
    console.log("API - Raw response text:", `"${rawText}"`);
    console.log("API - Raw text length:", rawText.length);

    if (rawText.trim() === "") {
      console.log("API - Response is empty, returning updated unit data");
      return unit as Unit;
    }

    console.log(
      "API - Response headers:",
      Object.fromEntries(res.headers.entries())
    );
    throw new Error(
      `Server returned invalid JSON: ${rawText.substring(0, 200)}`
    );
  }

  // Assume response is the updated unit or wrapped in UnitApiResponse
  if (
    responseData &&
    typeof responseData === "object" &&
    "success" in responseData
  ) {
    const unitApiResponse: UnitApiResponse = responseData;
    if (unitApiResponse.success && unitApiResponse.data) {
      return unitApiResponse.data;
    } else {
      throw new Error(
        unitApiResponse.error ||
          unitApiResponse.message ||
          "Failed to update unit"
      );
    }
  } else if (responseData) {
    return responseData as Unit;
  } else {
    throw new Error("No unit data received");
  }
}
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

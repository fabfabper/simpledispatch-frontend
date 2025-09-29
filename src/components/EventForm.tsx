import React from "react";
import { useTranslation } from "react-i18next";
import type { AutocompleteSuggestion } from "@fabfabper/simpledispatch-shared-models/typescript/AutocompleteSuggestion";
import {
  searchLocations,
  extractCoordinates,
  getLocationDisplayName,
} from "../services";

function EventForm({ event, onChange, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const isEdit = !!event;
  const [form, setForm] = React.useState(
    event
      ? {
          location: event.location,
          type: event.type,
          position: [event.position[0], event.position[1]],
        }
      : { location: "", type: "", position: ["", ""] }
  );

  // Autocomplete state
  const [searchResults, setSearchResults] = React.useState<
    AutocompleteSuggestion[]
  >([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (event) {
      setForm({
        location: event.location,
        type: event.type,
        position: [event.position[0], event.position[1]],
      });
    } else {
      setForm({ location: "", type: "", position: ["", ""] });
    }
  }, [event]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Search function for location autocomplete using geoApi service
  const searchLocation = async (searchText: string) => {
    if (searchText.length < 3) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocations(searchText, 5);
      setSearchResults(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Location search error:", error);
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (field, value) => {
    if (field === "position") {
      setForm({ ...form, position: value });
    } else {
      setForm({ ...form, [field]: value });
    }

    // Handle location search with debouncing
    if (field === "location") {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(value);
      }, 300); // 300ms debounce
    }

    if (onChange) onChange({ ...form, [field]: value });
  };

  // Handle location selection from search results
  const handleLocationSelect = (selectedLocation: AutocompleteSuggestion) => {
    const displayName = getLocationDisplayName(selectedLocation);
    const coordinates = extractCoordinates(selectedLocation);

    console.log("Selected location:", selectedLocation);
    console.log("Extracted coordinates:", coordinates);

    const updatedForm = {
      ...form,
      location: displayName,
    };

    // Update position fields if coordinates are available
    if (coordinates) {
      updatedForm.position = [
        coordinates.lat.toString(),
        coordinates.lng.toString(),
      ];
    }

    console.log("Updated form:", updatedForm);

    setForm(updatedForm);
    setShowSuggestions(false);
    setSearchResults([]);

    if (onChange) {
      onChange(updatedForm);
    }
  };

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit)
          onSubmit({
            ...form,
            position: [
              parseFloat(form.position[0]),
              parseFloat(form.position[1]),
            ],
          });
      }}
    >
      <h3 className="text-xl font-bold mb-2">
        {isEdit ? t("edit_event") : t("add_event")}
      </h3>
      <div className="relative">
        <label className="block text-sm font-semibold mb-1">
          {t("location")}
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            onBlur={() => {
              // Hide suggestions after a delay to allow clicking on suggestions
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onFocus={() => {
              if (searchResults.length > 0) setShowSuggestions(true);
            }}
            placeholder="Type at least 3 characters to search..."
            required
          />
          {isSearching && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}

          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleLocationSelect(result)}
                >
                  <div className="font-medium">
                    {getLocationDisplayName(result)}
                  </div>
                  {(result.city || result.region || result.country) && (
                    <div className="text-sm text-gray-600">
                      {[result.city, result.region, result.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">{t("type")}</label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">
          {t("latitude")}
        </label>
        <input
          type="number"
          step="any"
          className="w-full border rounded px-2 py-1"
          value={form.position[0]}
          onChange={(e) =>
            handleChange("position", [e.target.value, form.position[1]])
          }
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">
          {t("longitude")}
        </label>
        <input
          type="number"
          step="any"
          className="w-full border rounded px-2 py-1"
          value={form.position[1]}
          onChange={(e) =>
            handleChange("position", [form.position[0], e.target.value])
          }
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEdit ? t("save_changes") : t("add_event")}
        </button>
        {onCancel && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

export default EventForm;

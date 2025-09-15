import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { leafletIconForType } from "../utils";
import { statusMap } from "../constants";

function CenterMap({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, zoom, { animate: true });
    }
  }, [position, zoom, map]);
  return null;
}

function Map({ events, units, selectedId, selectedType, onMarkerClick }) {
  let selectedPosition = null;
  if (selectedType === "event") {
    const event = events.find((e) => e.id === selectedId);
    if (event) selectedPosition = event.position;
  } else if (selectedType === "unit") {
    const unit = units.find((u) => u.id === selectedId);
    if (unit && unit.latitude != null && unit.longitude != null) {
      selectedPosition = [unit.latitude, unit.longitude];
    }
  }
  const defaultCenter = [47.378177, 8.540192]; // Zurich HB (main station)
  const defaultZoom = 13;
  const highlightZoom = 16;

  const mapRef = useRef();

  useEffect(() => {
    if (!mapRef.current) return;
    // Wait for the Leaflet map instance to be available
    let leafletMap = null;
    if (mapRef.current.leafletElement) {
      leafletMap = mapRef.current.leafletElement;
    } else if (mapRef.current._leaflet_id) {
      leafletMap = mapRef.current;
    } else if (mapRef.current._context && mapRef.current._context.map) {
      leafletMap = mapRef.current._context.map;
    }
    if (!leafletMap) return;
  }, [mapRef.current]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        center={selectedPosition || defaultCenter}
        zoom={selectedPosition ? highlightZoom : defaultZoom}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <CenterMap
          key={selectedId + "-" + selectedType}
          position={selectedPosition || defaultCenter}
          zoom={selectedPosition ? highlightZoom : defaultZoom}
        />
        {events.map((event, index) => {
          // Ensure we have a valid key - use id if available, otherwise use index
          const key = event.id != null ? event.id : `event-marker-${index}`;
          // Get the icon, ensuring it's never null
          const icon = leafletIconForType(event.type, {
            size: selectedType === "event" && selectedId === event.id ? 40 : 32,
            iconSize:
              selectedType === "event" && selectedId === event.id
                ? [40, 40]
                : [32, 32],
            iconAnchor:
              selectedType === "event" && selectedId === event.id
                ? [20, 40]
                : [16, 32],
            color:
              selectedType === "event" && selectedId === event.id
                ? "#2563eb"
                : "#555",
          });

          // Only render marker if we have a valid position and icon
          if (!event.position || !icon) return null;

          return (
            <Marker
              key={key}
              position={event.position}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick("event", event.id),
              }}
            >
              <Popup>Event: {event.location}</Popup>
            </Marker>
          );
        })}
        {units.map((unit, index) => {
          // Ensure we have a valid key - use id if available, otherwise use index
          const key = unit.id != null ? unit.id : `unit-marker-${index}`;
          // Get the icon, ensuring it's never null
          const icon = leafletIconForType(unit.type, {
            size: selectedType === "unit" && selectedId === unit.id ? 40 : 32,
            iconSize:
              selectedType === "unit" && selectedId === unit.id
                ? [40, 40]
                : [32, 32],
            iconAnchor:
              selectedType === "unit" && selectedId === unit.id
                ? [20, 40]
                : [16, 32],
            color: statusMap[unit.status] || "#555",
          });

          // Only render marker if we have valid coordinates and icon
          if (unit.latitude == null || unit.longitude == null || !icon)
            return null;

          const unitPosition = [unit.latitude, unit.longitude];

          return (
            <Marker
              key={key}
              position={unitPosition}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick("unit", unit.id),
              }}
            >
              <Popup>Unit: {unit.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default Map;

// MapContextMenu.tsx
import React from "react";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  latlng?: LatLng | null;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function MapContextMenu({
  visible,
  x,
  y,
  latlng,
  onClose,
  children,
}: MapContextMenuProps) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 1000,
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        minWidth: 160,
        padding: 8,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children || (
        <>
          <div className="font-semibold mb-2">Map Context Menu</div>
          <div className="text-xs text-gray-500 mb-2">
            Lat: {latlng?.lat?.toFixed(5)}, Lng: {latlng?.lng?.toFixed(5)}
          </div>
          <button
            className="px-2 py-1 rounded bg-blue-500 text-white"
            onClick={onClose}
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}

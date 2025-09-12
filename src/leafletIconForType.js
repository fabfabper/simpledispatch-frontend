// leafletIconForType.js
import L from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { iconMap } from "./iconMap";

export function leafletIconForType(type, options = {}) {
  const IconComponent = iconMap[type];
  if (!IconComponent) return null;
  const size = options.size || 32;
  const circleSize = size * 1.4;
  const iconSize = size;
  const color = options.color || "#2563eb";
  const iconSvg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { size: iconSize, color })
  );
  const circleSvg = `
    <svg width="${circleSize}" height="${circleSize}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${
    circleSize / 2 - 2
  }" fill="#fff" stroke="${color}" stroke-width="2" />
      <g transform="translate(${(circleSize - iconSize) / 2}, ${
    (circleSize - iconSize) / 2
  })">
        ${iconSvg}
      </g>
    </svg>
  `;
  return L.divIcon({
    html: circleSvg,
    className: options.className || "",
    iconSize: options.iconSize || [circleSize, circleSize],
    iconAnchor: options.iconAnchor || [circleSize / 2, circleSize],
    popupAnchor: options.popupAnchor || [0, -circleSize],
  });
}

// constants/index.ts
import {
  FaFire,
  FaCarCrash,
  FaAmbulance,
  FaTruck,
  FaCar,
} from "react-icons/fa";

import iconMapJson from "./iconMap.json";

// Map from icon name strings to actual React components
const iconComponents = {
  FaFire,
  FaCarCrash,
  FaAmbulance,
  FaTruck,
  FaCar,
} as const;

// Create the iconMap by mapping JSON data to React components
export const iconMap: Record<string, any> = {};
Object.entries(iconMapJson).forEach(([key, iconName]) => {
  if (typeof iconName === "string" && iconName in iconComponents) {
    iconMap[key] = iconComponents[iconName as keyof typeof iconComponents];
  }
});

// statusMap is now handled by the configuration store

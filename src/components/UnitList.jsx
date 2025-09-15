import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../utils";
import { iconMap, statusMap } from "../constants";

function UnitList({ units, selectedId, onSelect }) {
  const { t } = useTranslation();
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{t("units")}</h2>
      <div className="grid gap-2">
        {units.map((unit, index) => {
          const Icon = iconMap[unit.type];
          const color = statusMap[unit.status] || "#e5e7eb";
          // Ensure we have a valid key - use id if available, otherwise use index
          const key = unit.id != null ? unit.id : `unit-${index}`;
          return (
            <div
              key={key}
              className={cn(
                "border rounded shadow-sm p-3 flex flex-col cursor-pointer transition-all",
                selectedId === unit.id
                  ? "border-blue-400 ring-2 ring-blue-200"
                  : "hover:border-gray-300"
              )}
              style={{ background: color }}
              onClick={() => onSelect("unit", unit.id)}
            >
              <div className="font-semibold text-base mb-1 flex items-center justify-between">
                <span>{unit.id}</span>
                {Icon && <Icon className="inline text-lg text-gray-500 ml-2" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UnitList;

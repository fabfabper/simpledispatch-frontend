import React from "react";
import { useTranslation } from "react-i18next";
import { cn, getUnitStatusColor } from "../utils";
import { iconMap } from "../constants";
import type { Unit } from "@fabfabper/simpledispatch-shared-models/typescript/Unit";

interface UnitListProps {
  units: Unit[];
  selectedId: string | null;
  onSelect: (type: "unit", id: string) => void;
  onDoubleClick: (unit: Unit) => void;
}

function UnitList({
  units,
  selectedId,
  onSelect,
  onDoubleClick,
}: UnitListProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{t("units")}</h2>
      <div className="grid gap-2">
        {units.map((unit, index) => {
          const Icon = iconMap[String(unit.type) as keyof typeof iconMap];
          const color = getUnitStatusColor(unit.status);
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
              onDoubleClick={
                onDoubleClick ? () => onDoubleClick(unit) : undefined
              }
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

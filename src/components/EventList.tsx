import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../utils";
import { iconMap } from "../constants";
import type { Event } from "@fabfabper/simpledispatch-shared-models/typescript/Event";

interface EventListProps {
  events: Event[];
  selectedId: number | null;
  onSelect: (type: "event", id: number) => void;
  onDoubleClick: (event: Event) => void;
}

function EventList({
  events,
  selectedId,
  onSelect,
  onDoubleClick,
}: EventListProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{t("events")}</h2>
      <div className="grid gap-2">
        {events.map((event) => {
          const Icon = iconMap[event.type as keyof typeof iconMap];
          return (
            <div
              key={event.id}
              className={cn(
                "bg-white border rounded shadow-sm p-3 flex flex-col cursor-pointer transition-all",
                selectedId === event.id
                  ? "border-blue-400 ring-2 ring-blue-200"
                  : "hover:border-gray-300"
              )}
              onClick={() => onSelect("event", event.id)}
              onDoubleClick={() => onDoubleClick(event)}
            >
              <div className="font-semibold text-base mb-1 flex items-center justify-between">
                <span>{event.location}</span>
                {Icon && <Icon className="inline text-lg text-gray-500 ml-2" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventList;

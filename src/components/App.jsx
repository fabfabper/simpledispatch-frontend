import { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatchStore } from "../utils";
import { useTranslation } from "react-i18next";
import EventList from "./EventList";
import UnitList from "./UnitList";
import Map from "./Map";
import EventForm from "./EventForm";
import UnitForm from "./UnitForm";
import { updateUnitApi } from "../services/api";
import "leaflet/dist/leaflet.css";
import "../App.css";

function App() {
  const wsRef = useRef(null);
  const { t, i18n } = useTranslation();
  // Sample data for events and units
  const { events, units, addEvent, updateEvent, updateUnit } =
    useDispatchStore();

  // Highlight state
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("lists");
  // Removed unused selectedEvent
  const [editEvent, setEditEvent] = useState(null);
  const [editUnit, setEditUnit] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const sidebarRef = useRef();
  const isResizing = useRef(false);

  useEffect(() => {
    // Import API and WebSocket modules
    import("../services/api").then(({ fetchEvents, fetchUnits }) => {
      fetchEvents()
        .then((data) => {
          if (Array.isArray(data)) {
            useDispatchStore.getState().setEvents(data);
          }
        })
        .catch((err) => console.error("Error fetching events:", err));
      fetchUnits()
        .then((data) => {
          if (Array.isArray(data)) {
            useDispatchStore.getState().setUnits(data);
          }
        })
        .catch((err) => console.error("Error fetching units:", err));
    });

    import("../services/websocket").then(
      ({ connectWebSocket, disconnectWebSocket }) => {
        wsRef.current = connectWebSocket((msg) => {
          // handle incoming messages here
          // Example: { type: 'event_update', event: {...} }
          // You can update Zustand store accordingly
        });
      }
    );
    return () => {
      import("../services/websocket").then(({ disconnectWebSocket }) => {
        disconnectWebSocket();
      });
    };
  }, []);

  // Mouse event handlers for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing.current) {
        const newWidth = Math.max(
          220,
          Math.min(window.innerWidth - 300, e.clientX)
        );
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      isResizing.current = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSelect = (type, id) => {
    setSelectedType(type);
    setSelectedId(id);
  };

  const handleMarkerClick = (type, id) => {
    setSelectedType(type);
    setSelectedId(id);
  };

  const handleEventDoubleClick = (event) => {
    setEditEvent(event);
    setActiveTab("details");
  };

  const handleUnitDoubleClick = (unit) => {
    setEditUnit(unit);
    setActiveTab("details");
  };

  return (
    <div className="dispatch-container flex h-screen w-screen bg-background text-foreground relative">
      <div
        ref={sidebarRef}
        className="sidebar border-r border-gray-200 overflow-y-auto relative"
        style={{ width: sidebarWidth, minWidth: 220 }}
      >
        <div className="flex border-b">
          <button
            className={
              `flex-1 py-2 border-b-2 transition-colors ` +
              (activeTab === "lists"
                ? "border-blue-600 bg-blue-100 text-blue-900 font-bold shadow-sm"
                : "border-transparent bg-transparent text-gray-700 hover:bg-gray-100")
            }
            onClick={() => setActiveTab("lists")}
            aria-current={activeTab === "lists" ? "page" : undefined}
          >
            {t("lists")}
          </button>
          <button
            className={
              `flex-1 py-2 border-b-2 transition-colors ` +
              (activeTab === "details"
                ? "border-blue-600 bg-blue-100 text-blue-900 font-bold shadow-sm"
                : "border-transparent bg-transparent text-gray-700 hover:bg-gray-100")
            }
            onClick={() => {
              setActiveTab("details");
              setEditEvent(null);
              setEditUnit(null);
            }}
            aria-current={activeTab === "details" ? "page" : undefined}
          >
            {t("details")}
          </button>
        </div>
        {activeTab === "lists" && (
          <div className="flex flex-col h-full">
            <div className="h-1/2 overflow-y-auto">
              <EventList
                events={events}
                selectedId={selectedType === "event" ? selectedId : null}
                onSelect={handleSelect}
                onDoubleClick={handleEventDoubleClick}
              />
            </div>
            <div className="h-1/2 overflow-y-auto">
              <UnitList
                units={units}
                selectedId={selectedType === "unit" ? selectedId : null}
                onSelect={handleSelect}
                onDoubleClick={handleUnitDoubleClick}
              />
            </div>
          </div>
        )}
        {activeTab === "details" && (
          <div className="p-4">
            {editEvent && (
              <EventForm
                event={editEvent}
                onSubmit={(updated) => {
                  updateEvent(editEvent.id, updated);
                  setEditEvent(null);
                  setActiveTab("lists");
                }}
                onCancel={() => {
                  setEditEvent(null);
                  setActiveTab("lists");
                }}
              />
            )}
            {editUnit && (
              <UnitForm
                unit={editUnit}
                onSubmit={async (updated) => {
                  try {
                    const saved = await updateUnitApi(editUnit.id, updated);
                    updateUnit(editUnit.id, saved);
                  } catch (err) {
                    alert((err && err.message) || "Failed to update unit");
                  }
                  setEditUnit(null);
                  setActiveTab("lists");
                }}
                onCancel={() => {
                  setEditUnit(null);
                  setActiveTab("lists");
                }}
              />
            )}
          </div>
        )}
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-50 bg-transparent hover:bg-blue-100"
          onMouseDown={() => {
            isResizing.current = true;
          }}
        />
      </div>
      <div className="absolute top-2 right-4 z-50 flex gap-2">
        <button
          className="px-2 py-1 rounded border"
          onClick={() => i18n.changeLanguage("en")}
        >
          EN
        </button>
        <button
          className="px-2 py-1 rounded border"
          onClick={() => i18n.changeLanguage("de")}
        >
          DE
        </button>
      </div>
      <div className="map-area flex-1 flex p-8 bg-white min-h-[400px] items-stretch relative">
        <Map
          events={events}
          units={units}
          selectedId={selectedId}
          selectedType={selectedType}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
}

export default App;

import type { AnyCommand } from "../types/websocket";
import { useDispatchStore } from "../utils/store";
import type { UnitCommand } from "@fabfabper/simpledispatch-shared-models/typescript/UnitCommand";
import type { EventCommand } from "@fabfabper/simpledispatch-shared-models/typescript/EventCommand";

let socket: WebSocket | null = null;

export function connectWebSocket(
  onMessage?: (msg: AnyCommand) => void
): WebSocket {
  socket = new WebSocket("ws://localhost:5000/ws");
  socket.onopen = () => {
    console.log("WebSocket connected");
  };
  socket.onmessage = (event) => {
    console.log("WebSocket message received:", event.data);
    let msg: AnyCommand;
    try {
      msg = JSON.parse(event.data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error, event.data);
      return;
    }
    if (isUnitCommand(msg)) {
      console.log("Received UnitCommand:", msg);
      useDispatchStore.getState().updateUnit(msg.payload.id, msg.payload);
    } else if (isEventCommand(msg)) {
      console.log("Received EventCommand:", msg);
      useDispatchStore.getState().updateEvent(msg.payload.id, msg.payload);
    } else {
      console.log("Received unknown message type:", msg);
    }
    if (onMessage) onMessage(msg);
  };
  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };
  return socket;
}

function isUnitCommand(cmd: any): cmd is UnitCommand {
  // Check for a property unique to UnitCommand, e.g. payload with 'status' and 'type'
  return (
    cmd &&
    cmd.payload &&
    typeof cmd.payload === "object" &&
    "status" in cmd.payload &&
    "type" in cmd.payload
  );
}

function isEventCommand(data: any): data is EventCommand {
  return (
    typeof data === "object" &&
    "payload" in data &&
    typeof data.payload === "object" &&
    typeof data.payload.id === "number"
  );
}

export function sendWebSocketMessage(data: unknown) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

// websocket.js
// WebSocket service for live updates

let socket = null;

export function connectWebSocket(onMessage) {
  socket = new WebSocket("ws://localhost:3002/messages");
  socket.onopen = () => {
    console.log("WebSocket connected");
  };
  socket.onmessage = (event) => {
    if (onMessage) onMessage(JSON.parse(event.data));
  };
  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };
  return socket;
}

export function sendWebSocketMessage(data) {
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

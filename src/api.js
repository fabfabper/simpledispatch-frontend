// api.js
// HTTP request functions for events and units

export async function fetchEvents() {
  const res = await fetch("http://localhost:5035/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function fetchUnits() {
  const res = await fetch("http://localhost:5035/api/units");
  if (!res.ok) throw new Error("Failed to fetch units");
  return res.json();
}

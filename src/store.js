import { create } from "zustand";

export const useDispatchStore = create((set) => ({
  events: [],
  units: [],
  setEvents: (events) => set({ events }),
  setUnits: (units) => set({ units }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updated) =>
    set((state) => ({
      events: state.events.map((ev) =>
        ev.id === id ? { ...ev, ...updated } : ev
      ),
    })),
  addUnit: (unit) => set((state) => ({ units: [...state.units, unit] })),
  updateUnit: (id, updated) =>
    set((state) => ({
      units: state.units.map((u) => (u.id === id ? { ...u, ...updated } : u)),
    })),
}));

import { create } from "zustand";
import { Unit } from "@fabfabper/simpledispatch-shared-models/typescript/Unit";
import { Event } from "@fabfabper/simpledispatch-shared-models/typescript/Event";

interface DispatchState {
  events: Event[];
  units: Unit[];
  setEvents: (events: Event[]) => void;
  setUnits: (units: Unit[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: number, updated: Partial<Event>) => void;
  addUnit: (unit: Unit) => void;
  updateUnit: (id: string, updated: Partial<Unit>) => void;
}

export const useDispatchStore = create<DispatchState>((set) => ({
  events: [],
  units: [],
  setEvents: (events: Event[]) => set({ events }),
  setUnits: (units: Unit[]) => set({ units }),
  addEvent: (event: Event) =>
    set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id: number, updated: Partial<Event>) =>
    set((state) => ({
      events: state.events.map((ev) =>
        ev.id === id ? { ...ev, ...updated } : ev
      ),
    })),
  addUnit: (unit: Unit) => set((state) => ({ units: [...state.units, unit] })),
  updateUnit: (id: string, updated: Partial<Unit>) =>
    set((state) => ({
      units: state.units.map((u) => (u.id === id ? { ...u, ...updated } : u)),
    })),
}));

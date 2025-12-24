import { create } from "zustand";

export const useDataStore = create((set) => ({
  settings: {},
  client: {},
  personas: [],
  calendars: [],
  posts: [],
  dailyCalendarLimit: 0,
  setSettings: (val) => set({ settings: val }),
  setClient: (val) => set({ client: val }),
  setPersonas: (val) => set({ personas: val }),
  setCalendars: (val) => set({ calendars: val }),
  setPosts: (val) => set({ posts: val }),
  setDailyCalendarLimit: (val) => set({ dailyCalendarLimit: val }),
}));

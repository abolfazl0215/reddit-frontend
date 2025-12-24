import { create } from "zustand";

export const useUIStore = create((set) => ({
  activeTab: "dashboard",
  isRefreshing: false,
  isLoading: false,
  showGenerateModal: false,
  showPostDetailModal: null,
  showPersonaModal: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsRefreshing: (val) => set({ isRefreshing: val }),
  setIsLoading: (val) => set({ isLoading: val }),
  setShowGenerateModal: (val) => set({ showGenerateModal: val }),
  setShowPostDetailModal: (val) => set({ showPostDetailModal: val }),
  setShowPersonaModal: (val) => set({ showPersonaModal: val }),
}));

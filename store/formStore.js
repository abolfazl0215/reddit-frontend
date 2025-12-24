import { create } from "zustand";

export const useFormStore = create((set) => ({
  // Generate form
  generateForm: {
    numberOfDays: "7days",
    postsPerDay: "1post",
  },
  setGenerateForm: (form) => set({ generateForm: form }),
  updateGenerateForm: (field, value) =>
    set((state) => ({
      generateForm: { ...state.generateForm, [field]: value },
    })),

  // Persona form
  personaForm: {
    userName: "",
    targetSubreddit: "",
    tonePersonality: "",
  },

  setPersonaForm: (form) => set({ personaForm: form }),
  updatePersonaForm: (field, value) =>
    set((state) => ({
      personaForm: { ...state.personaForm, [field]: value },
    })),

  // temporary values
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
  newSubreddit: "",
  setNewSubreddit: (val) => set({ newSubreddit: val }),
  newQuery: "",
  setNewQuery: (val) => set({ newQuery: val }),
}));

import { create } from "zustand";

// TODO: add proper note type
const useNoteStore = create((set) => ({
  currentNote: null,
  setCurrentNote: (note: string) => set({ currentNote: note }),
}));

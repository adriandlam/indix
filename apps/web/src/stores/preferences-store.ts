import { create } from "zustand";

type Preferences = {
  // Appearance settings
  fontSize: number;
  lineHeight: number;
  //   lineNumbers: boolean; // TODO: add this later

  // Behavior settings
  wordWrap: "off" | "on";
  spellCheck: boolean;
  autosave: boolean;
  autosaveInterval: number; // in seconds

  // Intelligence settings
  suggestions: boolean;
};

type PreferencesStore = {
  preferences: Preferences;
  setPreferences: (preferences: Partial<Preferences>) => void;
  updatePreference: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => void;
};

const usePreferencesStore = create<PreferencesStore>((set) => ({
  preferences: {
    // Appearance defaults
    fontSize: 16,
    lineHeight: 1.5,

    // Behavior defaults
    wordWrap: "off",
    spellCheck: false,
    autosave: true,
    autosaveInterval: 30, // 30 seconds

    // Intelligence defaults
    suggestions: true,
  },
  setPreferences: (newPreferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences },
    })),
  updatePreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),
}));

export default usePreferencesStore;

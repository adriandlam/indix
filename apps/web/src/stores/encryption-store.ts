import { create } from "zustand";

type EncryptionStore = {
  password: string | null;
  setPassword: (password: string) => void;
  encryptionKey: string | null;
  setEncryptionKey: (encryptionKey: string) => void;
};

const useEncryptionStore = create<EncryptionStore>((set) => ({
  password: null,
  setPassword: (password) => set({ password }),
  encryptionKey: null,
  setEncryptionKey: (encryptionKey) => set({ encryptionKey }),
}));

export default useEncryptionStore;

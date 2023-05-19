import { create } from "zustand";

const useStore = create((set, get) => ({
  frame: {
    number: null,
    active: false,
  },
  setFrame: (number = 0, active = false) => {
    set({ frame: { number, active } });
  },
  getFrame: () => get().frame,
}));
export { useStore };

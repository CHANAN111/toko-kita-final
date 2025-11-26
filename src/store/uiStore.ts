// src/store/uiStore.ts

import { create } from "zustand";

type ToastType = "success" | "error";

type UIState = {
  toast: {
    message: string;
    type: ToastType;
    isOpen: boolean;
  };
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  toast: {
    message: "",
    type: "success",
    isOpen: false,
  },
  showToast: (message, type = "success") => {
    set({ toast: { message, type, isOpen: true } });

    // Otomatis hilang setelah 3 detik
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, isOpen: false } }));
    }, 3000);
  },
  hideToast: () => {
    set((state) => ({ toast: { ...state.toast, isOpen: false } }));
  },
}));

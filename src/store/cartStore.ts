// src/store/cartStore.ts

import { create } from "zustand";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  increaseQuantity: (itemId: number) => void; // <-- Fungsi baru
  decreaseQuantity: (itemId: number) => void; // <-- Fungsi baru
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product) => {
    const cart = get();
    const existingItem = cart.items.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedItems = cart.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set({ items: updatedItems });
    } else {
      set({ items: [...cart.items, { ...product, quantity: 1 }] });
    }
  },
  removeFromCart: (itemId) => {
    set({ items: get().items.filter((item) => item.id !== itemId) });
  },
  clearCart: () => {
    set({ items: [] });
  },
  // --- LOGIKA FUNGSI BARU ---
  increaseQuantity: (itemId) => {
    const cart = get();
    const updatedItems = cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    set({ items: updatedItems });
  },
  decreaseQuantity: (itemId) => {
    const cart = get();
    const updatedItems = cart.items
      .map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); // Hapus item jika kuantitasnya 0
    set({ items: updatedItems });
  },
}));

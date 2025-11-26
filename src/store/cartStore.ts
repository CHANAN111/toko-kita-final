// src/store/cartStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Mendefinisikan tipe data untuk satu item di dalam keranjang
export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

// Mendefinisikan tipe untuk keseluruhan state keranjang kita
type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number) => void;
};

// Membuat store dengan Zustand dan membungkusnya dengan middleware 'persist'
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // State awal
      items: [],

      // Aksi untuk menambah item ke keranjang
      addToCart: (product) => {
        const cart = get();
        const existingItem = cart.items.find((item) => item.id === product.id);

        if (existingItem) {
          // Jika item sudah ada, panggil fungsi increaseQuantity
          cart.increaseQuantity(product.id);
        } else {
          // Jika item belum ada, tambahkan ke keranjang dengan kuantitas 1
          set({ items: [...cart.items, { ...product, quantity: 1 }] });
        }
      },

      // Aksi untuk menghapus item dari keranjang
      removeFromCart: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      // Aksi untuk mengosongkan keranjang
      clearCart: () => {
        set({ items: [] });
      },

      // Aksi untuk menambah kuantitas
      increaseQuantity: (itemId) => {
        const cart = get();
        const updatedItems = cart.items.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        set({ items: updatedItems });
      },

      // Aksi untuk mengurangi kuantitas
      decreaseQuantity: (itemId) => {
        const cart = get();
        // Hapus item jika kuantitasnya menjadi 0, jika tidak kurangi 1
        const updatedItems = cart.items
          .map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0);
        set({ items: updatedItems });
      },
    }),
    {
      name: "cart-storage", // Nama key di localStorage
    }
  )
);

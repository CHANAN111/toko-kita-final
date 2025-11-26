// src/components/AddToCartButton.tsx

"use client";

import { useCartStore, CartItem } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore"; // <-- 1. IMPOR STORE UI

type ProductForCart = Omit<CartItem, "quantity">;

type AddToCartButtonProps = {
  product: ProductForCart;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCartStore();
  const { showToast } = useUIStore(); // <-- 2. AMBIL FUNGSI SHOWTOAST

  const handleAddToCart = () => {
    addToCart(product);

    // 3. PANGGIL NOTIFIKASI KEREN KITA
    showToast(`Berhasil menambahkan ${product.name} ke keranjang!`, "success");
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg w-full active:scale-95 transition-transform"
    >
      Tambah ke Keranjang
    </button>
  );
}

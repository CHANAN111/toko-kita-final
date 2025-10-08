"use client"; // tandai sebagai client component

import { useCartStore, CartItem } from "@/store/cartStore";

// definisikan tipe untuk props yang akan diterima komponen ini
// kita hanya butuh sebagian data produk untuk dimasukan ke keranjang
type ProductForCart = Omit<CartItem, "quantity">;

type AddToCartButtonProps = {
  product: ProductForCart;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  // panggil 'store' kita dan ambil fungsi 'addToCart'
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart(product);
    // beri notifikasi sederhana ke pengguna
    alert(`"${product.name}" telah ditambahkan ke keranjang!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg w-full"
    >
      Tambah ke Keranjang
    </button>
  );
}

// src/app/keranjang/page.tsx

"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  // Ambil semua data dan fungsi yang kita butuhkan dari store
  const { items, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCartStore();

  // Hitung subtotal
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Jika keranjang kosong
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Keranjang Anda Kosong</h1>
        <Link
          href="/produk"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-md"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  // Jika ada item di keranjang
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-gray-200 py-4"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Pengatur Kuantitas */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-md">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="px-3 py-1 hover:bg-gray-200 rounded-l-md"
                >
                  -
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="px-3 py-1 hover:bg-gray-200 rounded-r-md"
                >
                  +
                </button>
              </div>
              <p className="font-semibold w-24 text-right">
                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-sm p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between font-bold text-lg">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <button className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-md">
            Lanjutkan ke Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

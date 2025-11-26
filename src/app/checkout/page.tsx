// src/app/checkout/page.tsx

"use client"; // ini fungsinya sebagai  halaman client dan berjalan di browser. dan bisa menggunakan hook

import { useSession } from "next-auth/react"; // ini hook dari next-auth untuk mengecek siapa yang lagi login
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // untuk pindah halaman
  const { items: cartItems, clearCart } = useCartStore();

  // State untuk memastikan komponen sudah dimuat di client (mencegah hydration error)
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + 20000; // Termasuk ongkos kirim

  useEffect(() => {
    // kenapa ada useEffect? untuk mengecek status login
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  const handleCheckout = async () => {
    // menangani klik tombol checkout
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems, total }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      clearCart();
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (err: unknown) {
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading") {
    return <p className="text-center mt-10">Memuat...</p>;
  }

  if (session) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Kolom Kiri: Formulir Checkout */}
        <div>
          <h1 className="text-3xl font-bold mb-8">Detail Pengiriman</h1>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                defaultValue={session.user?.name || ""}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                defaultValue={session.user?.email || ""}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Alamat Lengkap
              </label>
              <textarea
                id="address"
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Jl. Jendral Sudirman No. 123..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Pesanan */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">
            Ringkasan Pesanan
          </h2>

          {isClient && cartItems.length > 0 ? (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p>
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-6 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>Rp 20.000</span>
                </div>
                <div className="flex justify-between font-bold text-xl mt-2">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Keranjang Anda kosong atau sedang memuat...
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={isProcessing || cartItems.length === 0}
            className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Memproses..." : "Bayar Sekarang"}
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  return null;
}

// src/components/PromoModal.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Cek apakah pengguna sudah pernah menutup promo ini
    const hasSeenPromo = localStorage.getItem("hasSeenPromo");

    if (!hasSeenPromo) {
      // 2. Jika belum, tampilkan popup setelah jeda 3 detik
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      // Bersihkan timer jika komponen di-unmount (praktik yang baik)
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // 3. Simpan "ingatan" bahwa pengguna sudah melihat promo ini
    localStorage.setItem("hasSeenPromo", "true");
  };

  if (!isOpen) return null;

  return (
    // Overlay Hitam Transparan (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Kotak Modal */}
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative animate-bounce-in">
        {/* Tombol Close (X) di pojok kanan atas */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-white/80 rounded-full p-1 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Gambar Promo */}
        <div className="relative h-48 w-full">
          <Image
            src="https://picsum.photos/seed/popup/600/400"
            alt="Promo Spesial"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Konten Teks */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Diskon Pengguna Baru! 🎁
          </h2>
          <p className="text-gray-600 mb-6">
            Dapatkan potongan harga spesial <strong>20%</strong> untuk pembelian
            pertama Anda hari ini. Jangan lewatkan!
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/produk"
              onClick={handleClose} // Tutup modal saat diklik
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Belanja Sekarang
            </Link>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Nanti saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

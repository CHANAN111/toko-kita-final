// src/app/order-success/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Terima Kasih!</h1>
      <p className="text-lg mb-2">Pesanan Anda telah berhasil dibuat.</p>
      <p className="text-gray-600 mb-8">
        Nomor Pesanan Anda adalah: <strong>#{orderId}</strong>
      </p>
      <Link
        href="/produk"
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-md"
      >
        Lanjut Belanja
      </Link>
    </div>
  );
}

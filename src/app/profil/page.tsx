// src/app/profil/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Impor useState

// Definisikan tipe data untuk pesanan
type Order = {
  id: number;
  created_at: string;
  total_price: number;
  status: string;
};

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // State untuk menyimpan data pesanan dan status loading
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // useEffect untuk melindungi halaman (tidak berubah)
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [sessionStatus, router]);

  // useEffect baru untuk mengambil data pesanan
  useEffect(() => {
    // Pastikan kita hanya mengambil data jika pengguna sudah login
    if (sessionStatus === "authenticated") {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const response = await fetch("/api/orders");
          if (!response.ok) {
            throw new Error("Gagal mengambil data pesanan.");
          }
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [sessionStatus]); // Dijalankan setiap kali status sesi berubah

  // Tampilkan pesan loading utama
  if (sessionStatus === "loading") {
    return <p className="text-center mt-10">Memuat...</p>;
  }

  // Tampilkan halaman profil jika sudah login
  if (session) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Profil {session.user?.name}</h1>
        <p className="text-lg mb-6">Email: {session.user?.email}</p>

        <hr className="my-6" />

        <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
        {/* Tampilkan loading untuk pesanan */}
        {isLoadingOrders ? (
          <p>Memuat riwayat pesanan...</p>
        ) : (
          // Tampilkan tabel pesanan
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Rp {order.total_price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Anda belum memiliki pesanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return null;
}

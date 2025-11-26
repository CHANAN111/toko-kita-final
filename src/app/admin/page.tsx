// src/app/admin/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

// Tipe data produk
type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category_id: number;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. CEK KEAMANAN: Apakah user ini Admin?
  useEffect(() => {
    if (status === "loading") return;

    // Ambil email admin dari .env
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!session || session.user?.email !== adminEmail) {
      // Jika bukan admin, tendang ke halaman utama
      alert("Anda tidak memiliki akses ke halaman ini!");
      router.push("/");
    }
  }, [session, status, router]);

  // 2. Fetch Data Produk (Hanya jika admin)
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false }); // Produk terbaru di atas

      if (data) setProducts(data);
      setIsLoading(false);
    };

    if (session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      fetchProducts();
    }
  }, [session]);

  // 3. Fungsi Hapus Produk
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus produk ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus produk");
    } else {
      // Update state lokal agar produk hilang dari layar tanpa refresh
      setProducts(products.filter((product) => product.id !== id));
      alert("Produk berhasil dihapus");
    }
  };

  if (status === "loading" || isLoading) {
    return <p className="text-center mt-20">Memuat Dashboard Admin...</p>;
  }

  // Render Halaman Admin
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <Link href="/admin/add">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700">
            + Tambah Produk Baru
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Gambar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Harga
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative h-12 w-12">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  Rp {product.price.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

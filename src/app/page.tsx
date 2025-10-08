// src/app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Definisikan tipe data untuk produk kita
type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // useEffect untuk mengambil data PRODUK dari Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(3);

      if (error) {
        console.error("Gagal mengambil data produk:", error);
      } else if (data) {
        setFeaturedProducts(data);
      }
    };

    fetchProducts();
  }, []); // Berjalan sekali saat halaman dimuat

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-20 bg-conic from-blue-600 to-cyan-400 to-50% rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          Koleksi Minimalis untuk Gaya Anda
        </h1>
        <p className="text-lg text-white mb-8">
          Temukan kualitas terbaik dalam setiap potongan.
        </p>
        <Link
          href="/produk"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-md text-lg"
        >
          Lihat Semua Produk
        </Link>
      </section>

      {/* Featured Products Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Produk Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: `Rp ${product.price.toLocaleString("id-ID")}`,
                imageUrl: product.image_url,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

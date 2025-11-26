// src/app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";
import BannerSlider from "@/components/BannerSlider";
import PromoModal from "@/components/PromoModal";
import CategoryList from "@/components/CategoryList";
import Link from "next/link";

// Tipe data (sama seperti sebelumnya)
type Product = {
  id: number;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string;
  description: string;
};

type Banner = {
  id: number;
  image_url: string;
  link_url: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]); // <-- STATE BARU
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // 1. Fetch Produk Unggulan (Limit 3)
  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase.from("products").select("*").limit(3); // Ambil 3 saja
      if (data) setFeaturedProducts(data);
    };
    fetchFeatured();
  }, []);

  // 2. Fetch Produk Terbaru (Limit 8) <-- KODE BARU
  useEffect(() => {
    const fetchLatest = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }) // Urutkan dari yang paling baru
        .limit(8); // Ambil 8 produk
      if (data) setLatestProducts(data);
    };
    fetchLatest();
  }, []);

  // Fetch Banner
  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setBanners(data);
    };
    fetchBanners();
  }, []);

  // Fetch Kategori
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="pb-20">
      {" "}
      {/* Tambah padding bawah agar tidak mepet footer */}
      <section className="mb-8">
        <BannerSlider banners={banners} />
      </section>
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 px-2">Kategori Pilihan</h2>
        <CategoryList categories={categories} />
      </section>
      {/* Section Produk Unggulan */}
      <section className="mt-16">
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-3xl font-bold text-gray-800">Produk Unggulan</h2>
          <Link
            href="/produk"
            className="text-yellow-600 font-semibold hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.original_price,
                imageUrl: product.image_url,
              }}
            />
          ))}
        </div>
      </section>
      {/* --- SECTION BARU: PRODUK TERBARU --- */}
      <section className="mt-20 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
            <p className="text-gray-500 text-sm mt-1">
              Koleksi yang baru saja mendarat
            </p>
          </div>
          <Link
            href="/produk"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Lihat Lainnya &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.original_price,
                imageUrl: product.image_url,
              }}
            />
          ))}
        </div>
      </section>
      <PromoModal />
    </div>
  );
}

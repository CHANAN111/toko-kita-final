// src/app/produk/page.tsx

// LANGKAH 1: Impor client Supabase yang sudah ada
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

// Definisikan tipe data untuk produk
type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
};

export default async function ProductsPage() {
  // LANGKAH 2: Hapus pembuatan client baru di sini

  // Ambil SEMUA data dari tabel 'products', urutkan berdasarkan waktu dibuat
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // Jika gagal mengambil data, tampilkan pesan error
  if (error || !products) {
    return <p>Gagal memuat produk. Coba lagi nanti.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Semua Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product: Product) => (
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
    </div>
  );
}

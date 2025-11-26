// src/app/produk/page.tsx

import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string;
  description: string;
};

type ProductsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // 1. Baca parameter URL
  const resolvedSearchParams = await searchParams;
  const query =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";
  const categorySlug =
    typeof resolvedSearchParams.kategori === "string"
      ? resolvedSearchParams.kategori
      : "";

  // 2. Mulai query dasar
  let supabaseQuery = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Filter berdasarkan PENCARIAN (Search Bar)
  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  }

  // 4. Filter berdasarkan KATEGORI (Ikon)
  let categoryName = ""; // Untuk judul halaman
  if (categorySlug) {
    // Langkah A: Cari ID kategori berdasarkan slug-nya (misal: 'pakaian')
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id, name")
      .eq("slug", categorySlug)
      .single();

    if (categoryData) {
      // Langkah B: Jika ketemu, filter produk berdasarkan category_id tersebut
      supabaseQuery = supabaseQuery.eq("category_id", categoryData.id);
      categoryName = categoryData.name;
    }
  }

  // 5. Jalankan query final
  const { data: products, error } = await supabaseQuery;

  if (error) {
    return (
      <p className="text-center py-10 text-red-500">Gagal memuat produk.</p>
    );
  }

  // 6. Tentukan Judul Halaman
  let pageTitle = "Semua Produk";
  if (query) pageTitle = `Hasil Pencarian: "${query}"`;
  else if (categoryName) pageTitle = `Kategori: ${categoryName}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold capitalize">{pageTitle}</h1>
        <span className="text-gray-500">{products?.length || 0} produk</span>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: Product) => (
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
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
          <p className="text-xl text-gray-500">Produk tidak ditemukan.</p>
          <p className="text-gray-400 mt-2">
            {categorySlug
              ? `Belum ada produk di kategori "${categorySlug}"`
              : "Coba kata kunci lain."}
          </p>
        </div>
      )}
    </div>
  );
}

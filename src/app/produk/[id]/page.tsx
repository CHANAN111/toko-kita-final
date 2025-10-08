// Salin semua mulai dari sini
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select<"*", Product>("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return <p>Terjadi kesalahan saat mengambil data produk.</p>;
  }

  if (!product) {
    return <p>Produk tidak ditemukan.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl text-yellow-500 font-semibold">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        <p className="text-gray-500 mt-4">{product.description}</p>
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.image_url,
          }}
        />
      </div>
    </div>
  );
}
// Salin semua sampai sini

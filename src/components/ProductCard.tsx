// src/components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number; // Ubah jadi number agar bisa dihitung
  originalPrice?: number | null; // Prop baru (opsional)
  imageUrl: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  // Cek apakah produk sedang diskon
  const isDiscount =
    product.originalPrice && product.originalPrice > product.price;

  // Hitung persentase diskon (jika ada)
  const discountPercentage = isDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  return (
    <Link href={`/produk/${product.id}`}>
      <div className="border border-gray-200 rounded-lg overflow-hidden group bg-white relative">
        {/* BADGE DISKON (Hanya muncul jika diskon) */}
        {isDiscount && (
          <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {discountPercentage}% OFF
          </div>
        )}

        <div className="relative w-full h-64">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 bg-white">
          <h3 className="text-lg font-semibold truncate">{product.name}</h3>

          <div className="mt-2">
            {isDiscount ? (
              <div className="flex flex-col">
                {/* Harga Asli (Coret) */}
                <span className="text-xs text-gray-400 line-through">
                  Rp {product.originalPrice?.toLocaleString("id-ID")}
                </span>
                {/* Harga Diskon (Merah & Tebal) */}
                <span className="text-lg font-bold text-red-600">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </div>
            ) : (
              // Harga Normal
              <span className="text-lg font-bold text-gray-900">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

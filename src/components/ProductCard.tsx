import Image from "next/image";
import Link from "next/link";

// mendefinisikan tipe data sebuah produk dengan typescript
type Product = {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
};

// mendefinisikan tipe props untuk komponen productcard
type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produk/${product.id}`}>
      <div className="border border-gray-200 rounded-lg overflow-hidden group border-white">
        <div className="relative w-full h-64">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
          ></Image>
        </div>
        <div className="p-4 bg-white">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="mt-2 text-yellow-400">{product.price}</p>
        </div>
      </div>
    </Link>
  );
}

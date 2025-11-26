// src/components/CategoryList.tsx

import Image from "next/image";
import Link from "next/link";

// Definisikan tipe data Kategori
type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
};

type CategoryListProps = {
  categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/produk?kategori=${category.slug}`}
          className="group flex flex-col items-center gap-2 cursor-pointer"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-yellow-400 transition-colors">
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

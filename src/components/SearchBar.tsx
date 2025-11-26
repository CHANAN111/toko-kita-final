// src/components/SearchBar.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman

    if (query.trim()) {
      // Arahkan ke halaman produk dengan query parameter
      router.push(`/produk?search=${encodeURIComponent(query)}`);
    } else {
      // Jika kosong, kembalikan ke halaman produk tanpa filter
      router.push("/produk");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Cari barang..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-yellow-500 text-gray-900"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-yellow-100 hover:bg-yellow-200 rounded-full text-yellow-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </form>
  );
}

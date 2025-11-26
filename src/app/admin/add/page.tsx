// src/app/admin/add/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Tipe data kategori untuk dropdown
type Category = {
  id: number;
  name: string;
};

export default function AddProductPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // State untuk form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State data pendukung
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Cek Admin & Ambil Kategori
  useEffect(() => {
    if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      // Logic redirect sudah ada di page admin utama, tapi baiknya double check
    }

    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, [session]);

  // 2. Handle Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = "";

      // A. PROSES UPLOAD GAMBAR
      if (imageFile) {
        // Buat nama file unik (timestamp + nama asli)
        const fileName = `${Date.now()}-${imageFile.name}`;

        // Upload ke bucket 'images'
        const { error: uploadError } = await supabase.storage
          .from("images") // Pastikan nama bucket Anda benar!
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Dapatkan URL publik
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // B. SIMPAN DATA PRODUK KE DATABASE
      const { error: insertError } = await supabase.from("products").insert({
        name,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        description,
        category_id: Number(categoryId),
        image_url: imageUrl, // Link gambar dari Supabase Storage
      });

      if (insertError) throw insertError;

      alert("Produk berhasil ditambahkan!");
      router.push("/admin"); // Kembali ke dashboard
    } catch (error: unknown) {
      let errorMessage = "Gagal menambahkan produk.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error:", error);
      alert("Gagal menambahkan produk: " + errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Produk
          </label>
          <input
            type="text"
            required
            className="mt-1 w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Harga & Harga Asli */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Harga Jual
            </label>
            <input
              type="number"
              required
              className="mt-1 w-full p-2 border rounded-md"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Harga Asli (Opsional)
            </label>
            <input
              type="number"
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="Untuk diskon"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kategori
          </label>
          <select
            required
            className="mt-1 w-full p-2 border rounded-md bg-white"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Pilih Kategori...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deskripsi
          </label>
          <textarea
            required
            rows={4}
            className="mt-1 w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Foto Produk
          </label>
          <input
            type="file"
            accept="image/*"
            required
            className="mt-1 w-full p-2 border rounded-md"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isUploading ? "Sedang Mengupload..." : "Simpan Produk"}
        </button>
      </form>
    </div>
  );
}

// src/components/Navbar.tsx

"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useSession, signIn, signOut } from "next-auth/react"; // <-- Impor dari NextAuth
import Image from "next/image"; // Kita akan butuh ini untuk foto profil

export default function Navbar() {
  const { items } = useCartStore();
  const { data: session, status } = useSession(); // <-- Dapatkan data sesi

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white text-gray-900 border-b sticky top-0 z-10">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Toko */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          Toko Kita
        </Link>

        {/* Link Navigasi */}
        <ul className="flex gap-6">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link href="/produk" className="hover:text-blue-600">
              Produk
            </Link>
          </li>
        </ul>

        {/* Ikon Aksi (Keranjang & Login/Profil) */}
        <div className="flex items-center gap-4">
          <Link href="/keranjang" className="hover:text-blue-600">
            Keranjang ({totalItems})
          </Link>

          {/* Logika Kondisional untuk Tombol Login/Profil */}
          {status === "loading" ? (
            // Tampilkan placeholder saat sesi sedang dimuat
            <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          ) : session ? (
            // Jika pengguna sudah login, tampilkan info profil
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="hidden sm:block">
                Halo, {session.user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            // Jika pengguna belum login, tampilkan tombol login
            <Link
              href="/api/auth/signin"
              onClick={(e) => {
                e.preventDefault();
                signIn("google");
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

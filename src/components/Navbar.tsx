// src/components/Navbar.tsx

"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar"; // <-- 1. IMPOR INI

export default function Navbar() {
  const { items } = useCartStore();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white text-gray-900 border-b sticky top-0 z-20 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4 gap-4">
        {/* Logo Toko */}
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 flex-shrink-0"
        >
          Toko Kita
        </Link>

        {/* 2. PASANG SEARCH BAR DI SINI */}
        {/* hidden md:block artinya search bar disembunyikan di HP, muncul di Layar Sedang ke atas */}
        <div className="hidden md:block flex-1 mx-8">
          <SearchBar />
        </div>

        {/* Link Navigasi & Aksi */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link
            href="/produk"
            className="hover:text-blue-600 font-medium hidden sm:block"
          >
            Semua Produk
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/keranjang" className="hover:text-blue-600 relative">
              {/* Ikon Keranjang Sederhana */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>

              {isClient && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {status === "loading" ? (
              <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3 group relative">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={36}
                    height={36}
                    className="rounded-full border border-gray-200 cursor-pointer"
                  />
                ) : (
                  <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {session.user?.name?.charAt(0)}
                  </div>
                )}

                {/* Dropdown Menu Sederhana saat Hover */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  {/* Cek apakah email user sama dengan email admin di .env */}
                  {session.user?.email ===
                    process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 text-left font-semibold"
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <Link
                    href="/profil"
                    className="px-4 py-2 text-sm hover:bg-gray-50 text-left"
                  >
                    Profil Saya
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm hover:bg-gray-50 text-left text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md text-sm"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

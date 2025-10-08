// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
// Impor komponen layout kita
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Toko Kita - E-commerce Modern",
  description: "Toko online modern dibangun dengan Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4 min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

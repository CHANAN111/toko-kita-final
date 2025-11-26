// src/app/api/orders/route.ts

import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route"; // Impor authOptions

// Buat Supabase client KHUSUS untuk server-side
// Kita gunakan service key agar bisa melewati RLS dengan aman
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  // 1. Verifikasi sesi pengguna
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userEmail = session.user.email;

  try {
    // 2. Ambil data dari tabel 'orders'
    const { data, error } = await supabase
      .from("orders")
      .select("*") // Ambil semua kolom dari 'orders'
      .eq("user_email", userEmail) // Filter berdasarkan email pengguna
      .order("created_at", { ascending: false }); // Urutkan dari yang terbaru

    if (error) throw error;

    // 3. Kirim data pesanan kembali ke frontend
    return NextResponse.json(data);
  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Get Orders Error:", errorMessage);
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

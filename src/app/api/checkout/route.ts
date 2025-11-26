// src/app/api/checkout/route.ts

import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// Definisikan tipe data untuk item yang datang dari frontend
type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

// Buat Supabase client khusus untuk server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  // 1. Verifikasi sesi pengguna
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userEmail = session.user.email;
  const { cartItems, total } = (await request.json()) as {
    cartItems: CartItem[];
    total: number;
  };

  try {
    // 2. Buat entri baru di tabel 'orders'
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_email: userEmail,
        total_price: total,
        status: "pending",
      })
      .select()
      .single(); // .select().single() untuk mendapatkan data order yang baru dibuat, terutama ID-nya

    if (orderError) throw orderError;
    if (!orderData) throw new Error("Gagal membuat pesanan.");

    const orderId = orderData.id;

    // 3. Siapkan data untuk tabel 'order_items'
    const orderItemsData = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    // 4. Masukkan semua item ke tabel 'order_items'
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // 5. Jika semua berhasil, kirim respons sukses
    return NextResponse.json({
      message: "Pesanan berhasil dibuat!",
      orderId: orderId,
    });
  } catch (error: unknown) {
    // Kita siapkan pesan error default
    let errorMessage = "Terjadi kesalahan yang tidak diketahui.";

    // Kita periksa apakah 'error' ini adalah sebuah objek Error standar
    if (error instanceof Error) {
      // Jika ya, kita gunakan pesannya
      errorMessage = error.message;
    }

    console.error("Checkout Error:", errorMessage);
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

import { createClient } from "@supabase/supabase-js";

// Tanda seru (!) di sini memberitahu TypeScript bahwa kita yakin variabel ini ada.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

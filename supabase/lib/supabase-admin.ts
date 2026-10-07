import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL eksik.");
}

if (!secretKey) {
  throw new Error("SUPABASE_SECRET_KEY eksik.");
}

export const supabaseAdmin = createClient(url, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

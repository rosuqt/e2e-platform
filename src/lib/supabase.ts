import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;


if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error("Supabase environment variables are not set correctly.");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabase;

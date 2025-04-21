import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Debugging: Log environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environment variables are not set correctly.");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseKey);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

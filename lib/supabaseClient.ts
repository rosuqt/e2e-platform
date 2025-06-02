import { createClient } from '@supabase/supabase-js'

// Use NEXT_PUBLIC_ variables for client-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default createClient(supabaseUrl, supabaseAnonKey)

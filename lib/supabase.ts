import { createClient } from '@supabase/supabase-js';

// Hardcoded for testing
const supabaseUrl = 'https://dbuyxpovejdakzveiprx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRidXl4cG92ZWpkYWt6dmVpcHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Mjc4NTMsImV4cCI6MjA2MDQwMzg1M30.7MFg6b65VD_2HvntSJyqjmnzSrGdvIWhyaGOW0TnwmA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

import { createClient } from "@supabase/supabase-js";

// Supabase credentials from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

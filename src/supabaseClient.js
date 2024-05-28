const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'placeholder-url' && supabaseAnonKey !== 'placeholder-key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('Supabase URL or Anon key is missing or invalid. Supabase client not initialized.');
}

module.exports = { supabase };

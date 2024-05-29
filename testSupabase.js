const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  const { data, error } = await supabase.from('contracts').select('*');
  if (error) {
    console.error('Error connecting to Supabase:', error);
  } else {
    console.log('Data:', data);
  }
}

testConnection();

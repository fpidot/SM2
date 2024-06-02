const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase credentials are missing. Please update your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectContractSchema() {
  const { data, error } = await supabase
    .from('contracts') // Replace 'contracts' with the actual table name if different
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error querying contract schema:', error);
  } else {
    console.log('Contract schema:', Object.keys(data[0]));
  }
}

inspectContractSchema();


require('dotenv').config();

console.log('Checking Supabase Environment Variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim().length > 0 ? 'VALID' : 'INVALID (Empty or missing)');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim().length > 0 ? 'VALID' : 'INVALID (Empty or missing)');

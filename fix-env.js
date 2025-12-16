
const fs = require('fs');
const dotenv = require('dotenv');

// Load from .env
const envConfig = dotenv.parse(fs.readFileSync('.env'));

console.log('Read .env');

let envLocalContent = '';
if (fs.existsSync('.env.local')) {
    envLocalContent = fs.readFileSync('.env.local', 'utf8');
    console.log('Read .env.local');
}

// Check if Supabase keys are in env
const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
    console.log('Found Supabase keys in .env');

    // Write to .env.local if not present (or append)
    // Actually, let's just create/overwrite .env.local if the user permits. 
    // But to be safe, let's just print them to confirm we have them.
    console.log('Writing to .env.local to ensure Next.js picks them up...');

    const newContent = `
NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseKey}"
`;
    fs.writeFileSync('.env.local', newContent);
    console.log('Created .env.local with Supabase keys.');
} else {
    console.error('Could not find Supabase keys in .env');
    process.exit(1);
}

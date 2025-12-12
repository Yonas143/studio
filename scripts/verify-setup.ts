
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function verify() {
    console.log('🔍 Starting verification...');

    // 1. Check DB Connection
    try {
        console.log('Checking Database connection...');
        const userCount = await prisma.user.count();
        console.log(`✅ Database connected. Users found: ${userCount}`);
    } catch (e: any) {
        console.error('❌ Database connection failed:', e.message);
    }

    // 2. Check Storage logic (simulated)
    // We can't easily query bucket list with standard client unless we have service key, 
    // but we can check if client initializes.
    try {
        console.log('Checking Supabase Client initialization...');
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            throw new Error('Missing Supabase env vars');
        }
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        // Try a simple public request? (e.g. list buckets if public, but usually restricted)
        // Just checking init for now.
        console.log('✅ Supabase Client initialized with provided keys.');
    } catch (e: any) {
        console.error('❌ Supabase Client check failed:', e.message);
    }

    await prisma.$disconnect();
}

verify();

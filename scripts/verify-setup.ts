
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Explicitly load .env.local
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function verify() {
    console.log('🔍 Starting verification...');

    // 1. Check DB Connection
    try {
        console.log('Checking Database connection...');
        const userCount = await prisma.user.count();
        console.log(`✅ Database connected via transaction pooler. Users found: ${userCount}`);
    } catch (e: any) {
        console.error('❌ Database connection failed: ');
        console.error(e);
    }

    // 2. Check Supabase Client initialization
    try {
        console.log('Checking Supabase Client initialization...');
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            throw new Error('Missing Supabase env vars');
        }
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        console.log('✅ Supabase Client initialized with provided keys.');
    } catch (e: any) {
        console.error('❌ Supabase Client check failed:', e.message);
    }

    await prisma.$disconnect();
}

verify();

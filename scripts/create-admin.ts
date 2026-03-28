import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const email = 'yoniwin.yw@gmail.com';
    const password = 'abulu1184';

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (authError) {
        // Might already exist
        console.log('Auth create note:', authError.message);
    }

    const userId = authData?.user?.id;

    if (!userId) {
        // Try to find existing auth user
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users?.find(u => u.email === email);
        if (!existing) {
            console.error('❌ Could not create or find auth user');
            return;
        }
        console.log('Found existing auth user:', existing.id);

        // Upsert into User table
        const { error } = await supabase.from('User').upsert({
            id: existing.id,
            email,
            name: 'Yonas Mulugeta',
            role: 'superadmin',
        });
        if (error) console.error('DB error:', error.message);
        else console.log(`✅ ${email} set as superadmin`);
        return;
    }

    // Insert into User table
    const { error: dbError } = await supabase.from('User').upsert({
        id: userId,
        email,
        name: 'Yonas Mulugeta',
        role: 'superadmin',
    });

    if (dbError) {
        console.error('DB error:', dbError.message);
    } else {
        console.log(`✅ ${email} created and set as superadmin (id: ${userId})`);
    }
}

main();

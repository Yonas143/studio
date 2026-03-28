import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const email = 'yoniwin.yw@gmail.com';

    // Check if user exists in User table
    const { data: existing, error: fetchError } = await supabase
        .from('User')
        .select('id, email, role')
        .eq('email', email)
        .single();

    if (existing) {
        // Update role to superadmin
        const { error } = await supabase
            .from('User')
            .update({ role: 'superadmin' })
            .eq('email', email);

        if (error) {
            console.error('Failed to update role:', error.message);
        } else {
            console.log(`✅ ${email} promoted to superadmin`);
        }
    } else {
        // User not in DB yet — find their Supabase Auth ID and insert
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        const authUser = authUsers?.users?.find(u => u.email === email);

        if (!authUser) {
            console.error(`❌ No auth user found for ${email}. They need to sign up first.`);
            return;
        }

        const { error: insertError } = await supabase
            .from('User')
            .insert([{
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.full_name || 'Admin',
                role: 'superadmin',
            }]);

        if (insertError) {
            console.error('Failed to insert user:', insertError.message);
        } else {
            console.log(`✅ ${email} created and set as superadmin`);
        }
    }
}

main();

import { createClient } from '@/lib/supabase/server';

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: dbUser } = await supabase
        .from('User')
        .select('role')
        .eq('id', user.id)
        .single();

    return dbUser?.role === 'admin' || dbUser?.role === 'superadmin';
}

/**
 * Check if the current user is authenticated
 */
export async function isParticipant(): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(): Promise<string> {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error('Authentication required');
    }
    return user.id;
}

/**
 * Require admin role - throws error if user is not an admin
 */
export async function requireAdmin(): Promise<void> {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        throw new Error('Admin access required');
    }
}

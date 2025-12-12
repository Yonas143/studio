import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // Check Prisma User table for role
    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
    });

    return dbUser?.role === 'admin';
}

/**
 * Check if the current user is a participant
 */
export async function isParticipant(): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
}

/**
 * Require authentication - throws error if user is not authenticated
 * Used in server actions or API routes
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

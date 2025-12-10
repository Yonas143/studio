import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Check if the current user is an admin
 * Assumes 'admin' role is set in publicMetadata
 */
export async function isAdmin(): Promise<boolean> {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await currentUser();
    return user?.publicMetadata?.role === 'admin';
}

/**
 * Check if the current user is a participant
 */
export async function isParticipant(): Promise<boolean> {
    const { userId } = await auth();
    if (!userId) return false;
    // Default to true if logged in, or check metadata
    return true;
}

/**
 * Require authentication - throws error if user is not authenticated
 * Used in server actions or API routes
 */
export async function requireAuth(): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Authentication required');
    }
    return userId;
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

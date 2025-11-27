import { doc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from './types';

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(
    firestore: Firestore,
    uid: string
): Promise<UserProfile | null> {
    try {
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(
    firestore: Firestore,
    uid: string,
    role: 'admin' | 'participant'
): Promise<boolean> {
    const profile = await getUserProfile(firestore, uid);
    return profile?.role === role;
}

/**
 * Check if user is an admin
 */
export async function isAdmin(firestore: Firestore, uid: string): Promise<boolean> {
    return hasRole(firestore, uid, 'admin');
}



/**
 * Check if user is a participant
 */
export async function isParticipant(firestore: Firestore, uid: string): Promise<boolean> {
    return hasRole(firestore, uid, 'participant');
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export function requireAuth(user: User | null): asserts user is User {
    if (!user) {
        throw new Error('Authentication required');
    }
}

/**
 * Require admin role - throws error if user is not an admin
 */
export async function requireAdmin(firestore: Firestore, user: User | null): Promise<void> {
    requireAuth(user);
    const isUserAdmin = await isAdmin(firestore, user.uid);
    if (!isUserAdmin) {
        throw new Error('Admin access required');
    }
}



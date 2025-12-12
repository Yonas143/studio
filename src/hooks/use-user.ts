'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js';

// Define the shape of UserProfile based on Prisma User model
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'judge' | 'participant';
    photoURL?: string | null;
    createdAt: string;
    updatedAt: string;
}

export function useUser() {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user.email);
                } else {
                    setUser(null);
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('Error getting session:', error);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
                setUser(session.user);
                // Only fetch profile if not already set or if email changed
                if (!userProfile || userProfile.email !== session.user.email) {
                    await fetchProfile(session.user.email);
                }
            } else {
                setUser(null);
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchProfile = async (email: string | undefined) => {
        if (!email) return;

        try {
            // Try to fetch from 'User' table
            // Note: Assuming table name is 'User' with capital U, respecting Prisma default
            const { data, error } = await supabase
                .from('User')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                // Fallback if user exists in Auth but not DB (e.g. just registered)
                // We might want to create the user here? 
                // For now, construct a partial profile from metadata
                setUserProfile({
                    id: user?.id || '',
                    email: email,
                    name: user?.user_metadata?.full_name || email.split('@')[0],
                    role: 'participant', // Default role
                    photoURL: user?.user_metadata?.avatar_url,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            } else if (data) {
                setUserProfile(data as UserProfile);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        }
    };

    return { user, userProfile, loading, supabase };
}

// Export a useAuth hook for compatibility if needed, or just expose supabase client
export function useAuth() {
    const supabase = createClient();
    return supabase.auth;
}

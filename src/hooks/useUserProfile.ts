import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/storage';

interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    subscription_status: 'free' | 'premium';
    created_at: string;
}

export const useUserProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            //   try {
            //     const session = auth.getSession();
            //     if (!session?.user) {
            //       // Mock user for development
            //       setProfile({
            //         id: 'mock-user',
            //         email: 'emreslezko@gmail.com',
            //         full_name: 'Emre Slezko',
            //         subscription_status: 'free',
            //         created_at: new Date().toISOString(),
            //       });
            //       return;
            //     }

            //     const { data, error } = await supabase
            //       .from('profiles')
            //       .select('*')
            //       .eq('id', session.user.id)
            //       .single();

            //     if (error) {
            //       console.error('Error loading profile:', error);
            //       // Fallback to session data
            //       setProfile({
            //         id: session.user.id,
            //         email: session.user.email || '',
            //         subscription_status: 'free',
            //         created_at: session.user.created_at || new Date().toISOString(),
            //       });
            //     } else {
            //       setProfile(data);
            //     }
            //   } catch (error) {
            //     console.error('Error in loadProfile:', error);
            //     // Mock user for development
            //     setProfile({
            //       id: 'mock-user',
            //       email: 'emreslezko@gmail.com',
            //       full_name: 'Emre Slezko',
            //       subscription_status: 'free',
            //       created_at: new Date().toISOString(),
            //     });
            //   } finally {
            //     setLoading(false);
            //   }
        };

        loadProfile();
    }, []);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', profile.id);

            if (!error) {
                setProfile(prev => prev ? { ...prev, ...updates } : null);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return {
        profile,
        loading,
        updateProfile,
        isSubscribed: profile?.subscription_status === 'premium',
    };
};

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { zustandStorage } from '../lib/storage/zustand';
import { fetchProfile as fetchProfileAPI, updateProfile as updateProfileAPI } from '@/services/auth.service';

import { Profile } from '@/types/profile.d';

interface ProfileState {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
    subscription: any;
    // Actions
    fetchProfile: (userId: string) => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
    clearProfile: () => void;
    setProfile: (profile: Profile) => void;
    startRealtimeSubscription: (userId: string) => void;
    stopRealtimeSubscription: () => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            profile: null,
            loading: false,
            error: null,
            subscription: null,

            fetchProfile: async (userId: string) => {
                console.log('📥 Fetching profile for user:', userId);
                set({ loading: true, error: null });

                try {
                    const profile = await fetchProfileAPI(userId);
                    console.log('✅ Profile fetched successfully:', profile);
                    console.log('🔍 onboarding_completed value:', profile.onboarding_completed);
                    set({ profile, loading: false });

                    // Start realtime subscription
                    get().startRealtimeSubscription(userId);
                } catch (error) {
                    console.error('❌ Profile fetch error:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch profile',
                        loading: false
                    });
                }
            },

            updateProfile: async (updates) => {
                const { profile } = get();
                if (!profile) {
                    set({ error: 'No profile to update' });
                    return;
                }

                set({ loading: true, error: null });

                try {
                    const updatedProfile = await updateProfileAPI(profile.id, updates);
                    set({ profile: updatedProfile, loading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update profile',
                        loading: false
                    });
                }
            },

            startRealtimeSubscription: (userId: string) => {
                // Stop existing subscription if any
                get().stopRealtimeSubscription();

                const subscription = supabase
                    .channel('profile-changes')
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'users',
                            filter: `id=eq.${userId}`,
                        },
                        (payload) => {
                            if (payload.eventType === 'UPDATE' && payload.new) {
                                // Update profile with new data
                                set({ profile: payload.new as Profile });
                            } else if (payload.eventType === 'DELETE') {
                                // Clear profile if deleted
                                set({ profile: null });
                            }
                        }
                    )
                    .subscribe();

                set({ subscription });
            },

            stopRealtimeSubscription: () => {
                const { subscription } = get();
                if (subscription) {
                    supabase.removeChannel(subscription);
                    set({ subscription: null });
                }
            },

            clearProfile: () => {
                get().stopRealtimeSubscription();
                set({ profile: null, loading: false, error: null });
            },

            setProfile: (profile: Profile) => {
                set({ profile, error: null });
            },

        }),
        {
            name: 'profile-storage',
            storage: createJSONStorage(() => zustandStorage),
            // Only persist important data, not temporary states
            partialize: (state) => ({
                profile: state.profile,
            }),
            onRehydrateStorage: () => (state) => {
                // Restart realtime subscription if profile exists in cache
                if (state?.profile?.id) {
                    state.startRealtimeSubscription(state.profile.id);
                }
            },
        }
    )
);

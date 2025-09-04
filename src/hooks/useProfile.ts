import { useMemo, useCallback } from 'react';
import { useProfileStore } from '@/store/profile';
import { Profile } from '@/types/profile';

export const useProfile = () => {
    const {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        clearProfile,
        setProfile,
        startRealtimeSubscription,
        stopRealtimeSubscription
    } = useProfileStore();

    // Memoized helper to update only certain fields
    const updateProfileField = useCallback(async (field: keyof Profile, value: string | boolean) => {
        await updateProfile({ [field]: value });
    }, [updateProfile]);


    // Memoized helper to update premium status
    const updatePremiumStatus = useCallback(async (isPremium: boolean) => {
        await updateProfile({ is_premium: isPremium });
    }, [updateProfile]);

    // Memoized helper to update language
    const updateLanguage = useCallback(async (language: string) => {
        await updateProfile({ lang: language });
    }, [updateProfile]);

    // Memoized profile completion check
    const isProfileComplete = useMemo(() => {
        return !!(profile?.first_name && profile?.last_name &&
            profile.first_name.trim() !== '' && profile.last_name.trim() !== '');
    }, [profile?.first_name, profile?.last_name]);

    // Memoized premium status check
    const isPremiumUser = useMemo(() => {
        return profile?.is_premium === true;
    }, [profile?.is_premium]);

    return {
        // Profile state - optimized with memoization
        profile,
        loading,
        error,
        isProfileComplete,
        isPremiumUser,

        // Basic actions
        fetchProfile,
        updateProfile,
        clearProfile,
        setProfile,

        // Realtime
        startRealtimeSubscription,
        stopRealtimeSubscription,

        // Helpers for specific actions - all memoized
        updateProfileField,
        updatePremiumStatus,
        updateLanguage,
    };
};

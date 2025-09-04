import { supabase } from "@/lib/supabase";
import { DeviceType, Profile } from "@/types/profile.d";
import { Platform } from "react-native";

/**
 * Fetch profile for the current authenticated user
 * Creates a new profile if one doesn't exist
 */
export const fetchProfile = async (userId: string): Promise<Profile> => {
    console.log('🔍 fetchProfile called for userId:', userId);

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        console.log('🔍 Raw data from DB:', data);
        console.log('🔍 Error from DB:', error);

        if (error) {
            // If profile doesn't exist, create it
            if (error.code === 'PGRST116') {
                console.log('👤 Creating new profile for user');
                const { data: user } = await supabase.auth.getUser();

                if (user.user) {
                    const newProfile: Profile = {
                        id: user.user.id,
                        email: user.user.email!,
                        first_name: user.user.user_metadata?.first_name || '',
                        last_name: user.user.user_metadata?.last_name || '',
                        push_notifications_enabled: false,
                        onboarding_completed: false,
                        is_premium: false,
                        lang: 'en',
                        device_type: Platform.OS === 'android' ? DeviceType.ANDROID : DeviceType.IOS,
                    };

                    console.log('🔍 New profile to insert:', newProfile);

                    const { data: createdProfile, error: createError } = await supabase
                        .from('users')
                        .insert([newProfile])
                        .select()
                        .single();

                    console.log('🔍 Created profile result:', createdProfile);
                    if (createError) {
                        console.error('❌ Error creating profile:', createError);
                        throw createError;
                    }
                    return createdProfile;
                }
            }
            throw error;
        }

        console.log('✅ Returning existing profile:', data);
        return data;
    } catch (error) {
        console.error('fetchProfile API error:', error);
        throw error;
    }
};

/**
 * Update profile for the current authenticated user
 * RLS policies ensure user can only update their own profile
 */
export const updateProfile = async (
    userId: string,
    updates: Partial<Profile>
): Promise<Profile> => {
    console.log('🔄 Updating profile for user:', userId, updates);

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('❌ Error updating profile:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
    }

    console.log('✅ Profile updated successfully:', data);
    return data;
};

import { auth } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/user";
import { Session } from "@supabase/supabase-js";

export const anonymousSignIn = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
        // Create anonymous session
        const { data: { session }, error } = await supabase.auth.signInAnonymously();
        if (error) {
            throw error;
        }
        console.log(`Anonymous session created`, session?.user.id);
    }
    return data.session;
}

export const getSession = async (): Promise<Session | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        throw error;
    }
    return data.session;
}

export const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        throw error;
    }
    return data.user;
}

export const updateUserProfile = async (updates: User) => {
    try {
        const session = await getSession();
        if (!session) {
            throw new Error('No session found');
        }
        const { data, error } = await supabase.from('users').update(updates).eq('id', session.user.id);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

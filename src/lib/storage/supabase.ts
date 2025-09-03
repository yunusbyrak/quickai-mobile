import { storage } from '@/lib/storage/index';

// Supabase storage adapter for MMKV
export const supabaseStorage = {
    getItem: (key: string) => {
        try {
            return storage.auth.getString(key) ?? null;
        } catch (error) {
            console.error('Supabase getItem error:', error);
            return null;
        }
    },

    setItem: (key: string, value: string) => {
        try {
            storage.auth.set(key, value);
        } catch (error) {
            console.error('Supabase setItem error:', error);
            throw error;
        }
    },

    removeItem: (key: string) => {
        try {
            storage.auth.delete(key);
        } catch (error) {
            console.error('Supabase removeItem error:', error);
            throw error;
        }
    },
};

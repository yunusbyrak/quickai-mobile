import { StateStorage } from 'zustand/middleware';
import { storage } from '@/lib/storage';

// Zustand storage adapter for MMKV
export const zustandStorage: StateStorage = {
    setItem: (name, value) => {
        return storage.state.set(name, value);
    },
    getItem: (name) => {
        const value = storage.state.getString(name);
        return value ?? null;
    },
    removeItem: (name) => {
        return storage.state.delete(name);
    },
};

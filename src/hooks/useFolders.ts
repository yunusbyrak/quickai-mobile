import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { MMKV } from 'react-native-mmkv';
import type { Folder, CreateFolderInput, UpdateFolderInput } from '@/types/folder';
import { supabase } from '@/lib/supabase';
import { useProfile } from './useProfile';
import { TablesInsert } from '@/types/database';

const storage = new MMKV();
const FOLDERS_CACHE_KEY = 'folders_cache';

interface UseFoldersOptions {
    // Add any filtering options if needed in the future
}

interface UseFoldersResult {
    folders: Folder[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createFolder: (folder: CreateFolderInput) => Promise<Folder | null>;
    updateFolder: (folderId: string, updates: UpdateFolderInput) => Promise<void>;
    deleteFolder: (folderId: string) => Promise<void>;
}

function getFoldersFromCache(): Folder[] {
    const cached = storage.getString(FOLDERS_CACHE_KEY);
    if (!cached) return [];
    try {
        return JSON.parse(cached) as Folder[];
    } catch {
        return [];
    }
}

function setFoldersToCache(folders: Folder[]) {
    storage.set(FOLDERS_CACHE_KEY, JSON.stringify(folders));
}

export const useFolders = (options?: UseFoldersOptions): UseFoldersResult => {
    const [folders, setFolders] = useState<Folder[]>(getFoldersFromCache());
    const [loading, setLoading] = useState<boolean>(folders.length === 0);
    const [error, setError] = useState<string | null>(null);
    const { profile } = useProfile();

    const fetchFolders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: supabaseError } = await supabase
                .from('folders')
                .select('*') // Includes count field from database
                .order('created_at', { ascending: false });

            if (supabaseError) {
                throw supabaseError;
            }

            if (data) {
                setFolders(data as Folder[]);
                setFoldersToCache(data as Folder[]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch folders');
            // Always load from cache synchronously if error
            setFolders(getFoldersFromCache());
        } finally {
            setLoading(false);
        }
    }, []);

    const createFolder = useCallback(async (folderInput: CreateFolderInput): Promise<Folder | null> => {
        try {
            const insertData: TablesInsert<'folders'> = {
                user_id: profile?.id,
                title: folderInput.title,
                description: null
            }
            const { data, error: supabaseError } = await supabase
                .from('folders')
                .insert([insertData])
                .select()
                .single();

            if (supabaseError) {
                throw supabaseError;
            }
        } catch (err: any) {
            console.log(err);
            setError(err.message || 'Failed to create folder');
            throw err;
        }
        return null;
    }, []);

    const updateFolder = useCallback(async (folderId: string, updates: UpdateFolderInput) => {
        try {
            const { data, error: supabaseError } = await supabase
                .from('folders')
                .update({
                    ...updates
                })
                .eq('id', folderId)
                .select()
                .single();

            if (supabaseError) {
                throw supabaseError;
            }

            if (data) {
                const updatedFolder = data as Folder;
                setFolders(currentFolders => {
                    const updated = currentFolders.map(folder =>
                        folder.id === folderId ? updatedFolder : folder
                    );
                    setFoldersToCache(updated);
                    return updated;
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update folder');
            throw err;
        }
    }, []);

    const deleteFolder = useCallback(async (folderId: string) => {
        try {
            const { error: supabaseError } = await supabase
                .from('folders')
                .delete()
                .eq('id', folderId);

            if (supabaseError) {
                throw supabaseError;
            }

            setFolders(currentFolders => {
                const updated = currentFolders.filter(folder => folder.id !== folderId);
                setFoldersToCache(updated);
                return updated;
            });
        } catch (err: any) {
            setError(err.message || 'Failed to delete folder');
            throw err;
        }
    }, []);

    // Subscribe to realtime changes and refetch when component comes into focus
    useFocusEffect(
        useCallback(() => {
            // Fetch folders when component comes into focus
            fetchFolders();

            const channel = supabase
                .channel('public:folders')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'folders' },
                    (payload) => {
                        // Update cached folders directly based on the change
                        const { eventType, new: newRecord, old: oldRecord } = payload;

                        setFolders(currentFolders => {
                            let updatedFolders = [...currentFolders];

                            switch (eventType) {
                                case 'INSERT':
                                    if (newRecord) {
                                        // Check if folder already exists to avoid duplicates
                                        const exists = updatedFolders.some(folder => folder.id === newRecord.id);
                                        if (!exists) {
                                            updatedFolders.unshift(newRecord as Folder);
                                        }
                                    }
                                    break;
                                case 'UPDATE':
                                    if (newRecord) {
                                        const index = updatedFolders.findIndex(folder => folder.id === newRecord.id);
                                        if (index !== -1) {
                                            updatedFolders[index] = newRecord as Folder;
                                        } else {
                                            // If folder not found in current list, add it
                                            updatedFolders.unshift(newRecord as Folder);
                                        }
                                    }
                                    break;
                                case 'DELETE':
                                    if (oldRecord) {
                                        updatedFolders = updatedFolders.filter(folder => folder.id !== oldRecord.id);
                                    }
                                    break;
                            }

                            // Update cache with new folders
                            setFoldersToCache(updatedFolders);
                            return updatedFolders;
                        });
                    }
                )
                .subscribe((status) => {
                    console.log('Realtime subscription status:', status);
                });

            return () => {
                supabase.removeChannel(channel);
            };
        }, [fetchFolders])
    );

    return {
        folders,
        loading,
        error,
        refresh: fetchFolders,
        createFolder,
        updateFolder,
        deleteFolder
    };
};

export type { Folder, CreateFolderInput, UpdateFolderInput, UseFoldersOptions };

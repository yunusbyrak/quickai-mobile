import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { Folder, CreateFolderInput, UpdateFolderInput } from '@/types/folder';
import { useFolderStore, useFolderActions, useFolderData } from '@/store/folder';
import { useProfile } from './useProfile';

interface UseFoldersOptions {
    // Add any filtering options if needed in the future
    autoFetch?: boolean; // Whether to auto-fetch on mount/focus
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

export const useFolders = (options?: UseFoldersOptions): UseFoldersResult => {
    const { autoFetch = true } = options || {};
    const { profile } = useProfile();

    // Get data from store
    const { folders, loading, error, initialized } = useFolderData();

    // Get actions from store
    const actions = useFolderActions();

    // Wrapper for createFolder to inject user ID
    const createFolder = useCallback(async (folderInput: CreateFolderInput): Promise<Folder | null> => {
        return actions.createFolder(folderInput, profile?.id);
    }, [actions.createFolder, profile?.id]);

    // Initialize store and fetch data if needed
    useEffect(() => {
        if (autoFetch && !initialized) {
            actions.fetchFolders();
        }

        // Ensure realtime is initialized
        actions.initializeRealtime();
    }, [autoFetch, initialized, actions.fetchFolders, actions.initializeRealtime]);

    // Optionally refetch when component comes into focus
    useFocusEffect(
        useCallback(() => {
            if (autoFetch) {
                // Only refresh if data is stale or if explicitly requested
                // You can add staleness logic here if needed
                actions.refresh();
            }
        }, [autoFetch, actions.refresh])
    );

    return {
        folders,
        loading,
        error,
        refresh: actions.refresh,
        createFolder,
        updateFolder: actions.updateFolder,
        deleteFolder: actions.deleteFolder,
    };
};

export type { Folder, CreateFolderInput, UpdateFolderInput, UseFoldersOptions };

import { useEffect, useCallback, useMemo } from 'react';
import type { Note } from '@/types/note';
import { useNotesStore, useNotesActions, useNotesData } from '@/store/notes';

interface UseNotesOptions {
    folderId?: string | null;
    favorite?: boolean;
    autoFetch?: boolean; // Whether to auto-fetch on mount
}

interface UseNotesResult {
    notes: Note[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
    updateNoteFavorite: (noteId: string, favorite: boolean) => Promise<void>;
    updateNoteFolder: (noteId: string, folderId: string | null) => Promise<void>;
    getNoteById: (noteId: string) => Note | undefined;
}

export const useNotes = (options?: UseNotesOptions): UseNotesResult => {
    const { folderId, favorite, autoFetch = true } = options || {};

    // Get data from store
    const { notes: allNotes, loading, error, initialized } = useNotesData();

    // Get actions from store
    const actions = useNotesActions();

    // Filter notes based on options using the store's filtering method
    const notes = useMemo(() => {
        return actions.getFilteredNotes(folderId, favorite);
    }, [allNotes, folderId, favorite, actions.getFilteredNotes]);

    // Initialize store and fetch data if needed
    useEffect(() => {
        if (autoFetch && !initialized) {
            actions.fetchNotes();
        }

        // Ensure realtime is initialized
        actions.initializeRealtime();
    }, [autoFetch, initialized, actions.fetchNotes, actions.initializeRealtime]);

    return {
        notes,
        loading,
        error,
        refresh: actions.refresh,
        deleteNote: actions.deleteNote,
        updateNoteFavorite: actions.updateNoteFavorite,
        updateNoteFolder: actions.updateNoteFolder,
        getNoteById: actions.getNoteById,
    };
};

export type { Note, UseNotesOptions };


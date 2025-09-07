import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';
import type { Note } from '@/types/note';
import { supabase } from '@/lib/supabase';

const storage = new MMKV();
const NOTES_CACHE_KEY = 'notes_cache';

interface UseNotesOptions {
    folderId?: string | null;
}

interface UseNotesResult {
    notes: Note[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

function getNotesFromCache(folderId?: string | null): Note[] {
    const cacheKey = folderId ? `${NOTES_CACHE_KEY}_${folderId}` : NOTES_CACHE_KEY;
    const cached = storage.getString(cacheKey);
    if (!cached) return [];
    try {
        return JSON.parse(cached) as Note[];
    } catch {
        return [];
    }
}

function setNotesToCache(notes: Note[], folderId?: string | null) {
    const cacheKey = folderId ? `${NOTES_CACHE_KEY}_${folderId}` : NOTES_CACHE_KEY;
    storage.set(cacheKey, JSON.stringify(notes));
}

export const useNotes = (options?: UseNotesOptions): UseNotesResult => {
    const { folderId } = options || {};
    const [notes, setNotes] = useState<Note[]>(getNotesFromCache(folderId));
    const [loading, setLoading] = useState<boolean>(notes.length === 0);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from('notes')
                .select()
                .order('created_at', { ascending: false });

            // Filter by folder_id if provided
            if (folderId !== undefined) {
                if (folderId === null) {
                    // Get notes without folder (folder_id is null)
                    query = query.is('folder_id', null);
                } else {
                    // Get notes with specific folder_id
                    query = query.eq('folder_id', folderId);
                }
            }

            const { data, error: supabaseError } = await query;

            if (supabaseError) {
                throw supabaseError;
            }

            if (data) {
                setNotes(data as Note[]);
                setNotesToCache(data as Note[], folderId);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch notes');
            // Always load from cache synchronously if error
            setNotes(getNotesFromCache(folderId));
        } finally {
            setLoading(false);
        }
    }, [folderId]);

    // Subscribe to realtime changes
    useEffect(() => {
        fetchNotes();

        const channel = supabase
            .channel('public:notes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notes' },
                (payload) => {
                    // Only refetch if the change affects our current filter
                    const changedNote = payload.new as Note || payload.old as Note;
                    if (changedNote) {
                        const shouldRefetch = folderId === undefined ||
                            (folderId === null && changedNote.folder_id === null) ||
                            (folderId !== null && changedNote.folder_id === folderId);

                        if (shouldRefetch) {
                            fetchNotes();
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNotes, folderId]);

    // Keep notes state in sync with MMKV cache if it changes externally
    useEffect(() => {
        // MMKV does not have a native event system, but if you add one, sync here.
        // For now, this is a placeholder for future sync logic.
    }, [folderId]);

    return {
        notes,
        loading,
        error,
        refresh: fetchNotes,
    };
};

export type { Note, UseNotesOptions };


import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';
import type { Note } from '@/types/note';
import { supabase } from '@/lib/supabase';

const storage = new MMKV();
const NOTES_CACHE_KEY = 'notes_cache';

interface UseNotesOptions {
    folderId?: string | null;
    favorite?: boolean;
}

interface UseNotesResult {
    notes: Note[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

function getNotesFromCache(): Note[] {
    const cached = storage.getString(NOTES_CACHE_KEY);
    if (!cached) return [];
    try {
        return JSON.parse(cached) as Note[];
    } catch {
        return [];
    }
}

function setNotesToCache(notes: Note[]) {
    storage.set(NOTES_CACHE_KEY, JSON.stringify(notes));
}

function filterNotes(notes: Note[], folderId?: string | null, favorite?: boolean): Note[] {
    return notes.filter(note => {
        // Filter by folder_id
        if (folderId !== undefined) {
            if (folderId === null && note.folder_id !== null) return false;
            if (folderId !== null && note.folder_id !== folderId) return false;
        }

        // Filter by favorite
        if (favorite !== undefined && note.favorite !== favorite) return false;

        return true;
    });
}

export const useNotes = (options?: UseNotesOptions): UseNotesResult => {
    const { folderId, favorite } = options || {};
    const [allNotes, setAllNotes] = useState<Note[]>(getNotesFromCache());
    const [loading, setLoading] = useState<boolean>(allNotes.length === 0);
    const [error, setError] = useState<string | null>(null);

    // Filter notes based on options
    const notes = filterNotes(allNotes, folderId, favorite);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: supabaseError } = await supabase
                .from('notes')
                .select()
                .order('created_at', { ascending: false });

            if (supabaseError) {
                throw supabaseError;
            }

            if (data) {
                setAllNotes(data as Note[]);
                setNotesToCache(data as Note[]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch notes');
            // Always load from cache synchronously if error
            setAllNotes(getNotesFromCache());
        } finally {
            setLoading(false);
        }
    }, []);

    // Subscribe to realtime changes
    useEffect(() => {
        fetchNotes();

        const channel = supabase
            .channel('public:notes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notes' },
                (payload) => {
                    // Update cached notes directly based on the change
                    const { eventType, new: newRecord, old: oldRecord } = payload;

                    setAllNotes(currentNotes => {
                        let updatedNotes = [...currentNotes];

                        switch (eventType) {
                            case 'INSERT':
                                if (newRecord) {
                                    updatedNotes.unshift(newRecord as Note);
                                }
                                break;
                            case 'UPDATE':
                                if (newRecord) {
                                    const index = updatedNotes.findIndex(note => note.id === newRecord.id);
                                    if (index !== -1) {
                                        updatedNotes[index] = newRecord as Note;
                                    }
                                }
                                break;
                            case 'DELETE':
                                if (oldRecord) {
                                    updatedNotes = updatedNotes.filter(note => note.id !== oldRecord.id);
                                }
                                break;
                        }

                        // Update cache with new notes
                        setNotesToCache(updatedNotes);
                        return updatedNotes;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNotes]);

    // Keep notes state in sync with MMKV cache if it changes externally
    useEffect(() => {
        // MMKV does not have a native event system, but if you add one, sync here.
        // For now, this is a placeholder for future sync logic.
    }, []);

    return {
        notes,
        loading,
        error,
        refresh: fetchNotes,
    };
};

export type { Note, UseNotesOptions };


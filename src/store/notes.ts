import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { zustandStorage } from '@/lib/storage/zustand';
import type { Note } from '@/types/note';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface NotesState {
  // State
  notes: Note[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Realtime subscription
  realtimeChannel: RealtimeChannel | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setNotes: (notes: Note[]) => void;

  // API Actions
  fetchNotes: () => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  updateNoteFavorite: (noteId: string, favorite: boolean) => Promise<void>;

  // Realtime management
  initializeRealtime: () => void;
  cleanupRealtime: () => void;

  // Filtering utilities
  getNotesByFolder: (folderId?: string | null) => Note[];
  getFavoriteNotes: () => Note[];
  getFilteredNotes: (folderId?: string | null, favorite?: boolean) => Note[];

  // Utility
  refresh: () => Promise<void>;
  reset: () => void;
}

// Singleton pattern for realtime subscription
let notesRealtimeInitialized = false;

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      // Initial state
      notes: [],
      loading: false,
      error: null,
      initialized: false,
      realtimeChannel: null,

      // State setters
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setNotes: (notes) => set({ notes }),

      // Fetch notes from API
      fetchNotes: async () => {
        const state = get();
        if (state.loading) return; // Prevent concurrent requests

        set({ loading: true, error: null });

        try {
          const { data, error: supabaseError } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

          if (supabaseError) {
            throw supabaseError;
          }

          if (data) {
            set({
              notes: data as Note[],
              loading: false,
              initialized: true
            });
          }
        } catch (err: any) {
          console.error('Failed to fetch notes:', err);
          set({
            error: err.message || 'Failed to fetch notes',
            loading: false
          });
        }
      },

      // Delete note
      deleteNote: async (noteId: string) => {
        try {
          set({ error: null });

          const { error: supabaseError } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);

          if (supabaseError) {
            throw supabaseError;
          }

          // Optimistically update the store
          const currentNotes = get().notes;
          const updatedNotes = currentNotes.filter(note => note.id !== noteId);
          set({ notes: updatedNotes });
        } catch (err: any) {
          console.error('Failed to delete note:', err);
          set({ error: err.message || 'Failed to delete note' });
          throw err;
        }
      },

      // Update note favorite status
      updateNoteFavorite: async (noteId: string, favorite: boolean) => {
        try {
          set({ error: null });

          const { error: supabaseError } = await supabase
            .from('notes')
            .update({ favorite })
            .eq('id', noteId);

          if (supabaseError) {
            throw supabaseError;
          }

          // Optimistically update the store
          const currentNotes = get().notes;
          const updatedNotes = currentNotes.map(note =>
            note.id === noteId ? { ...note, favorite } : note
          );
          set({ notes: updatedNotes });
        } catch (err: any) {
          console.error('Failed to update note favorite:', err);
          set({ error: err.message || 'Failed to update note favorite' });
          throw err;
        }
      },

      // Initialize realtime subscription (singleton)
      initializeRealtime: () => {
        if (notesRealtimeInitialized) {
          return; // Already initialized
        }

        console.log('Initializing notes realtime subscription...');
        notesRealtimeInitialized = true;

        const channel = supabase
          .channel('public:notes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'notes' },
            (payload) => {
              console.log('Notes realtime event:', payload.eventType, payload);

              const { eventType, new: newRecord, old: oldRecord } = payload;
              const currentState = get();

              switch (eventType) {
                case 'INSERT':
                  if (newRecord) {
                    const noteExists = currentState.notes.some(
                      note => note.id === newRecord.id
                    );
                    if (!noteExists) {
                      set({
                        notes: [newRecord as Note, ...currentState.notes]
                      });
                    }
                  }
                  break;

                case 'UPDATE':
                  if (newRecord) {
                    const updatedNotes = currentState.notes.map(note =>
                      note.id === newRecord.id ? (newRecord as Note) : note
                    );
                    set({ notes: updatedNotes });
                  }
                  break;

                case 'DELETE':
                  if (oldRecord) {
                    const filteredNotes = currentState.notes.filter(
                      note => note.id !== oldRecord.id
                    );
                    set({ notes: filteredNotes });
                  }
                  break;
              }
            }
          )
          .subscribe((status) => {
            console.log('Notes realtime subscription status:', status);
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to notes changes');
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Error subscribing to notes changes');
              notesRealtimeInitialized = false; // Allow retry
            }
          });

        set({ realtimeChannel: channel });
      },

      // Cleanup realtime subscription
      cleanupRealtime: () => {
        const state = get();
        if (state.realtimeChannel) {
          console.log('Cleaning up notes realtime subscription...');
          supabase.removeChannel(state.realtimeChannel);
          set({ realtimeChannel: null });
          notesRealtimeInitialized = false;
        }
      },

      // Filtering utilities
      getNotesByFolder: (folderId?: string | null) => {
        const notes = get().notes;
        return notes.filter(note => {
          if (folderId === undefined) return true;
          if (folderId === null && note.folder_id !== null) return false;
          if (folderId !== null && note.folder_id !== folderId) return false;
          return true;
        });
      },

      getFavoriteNotes: () => {
        const notes = get().notes;
        return notes.filter(note => note.favorite === true);
      },

      getFilteredNotes: (folderId?: string | null, favorite?: boolean) => {
        const notes = get().notes;
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
      },

      // Refresh notes
      refresh: async () => {
        await get().fetchNotes();
      },

      // Reset store state
      reset: () => {
        get().cleanupRealtime();
        set({
          notes: [],
          loading: false,
          error: null,
          initialized: false,
          realtimeChannel: null,
        });
        notesRealtimeInitialized = false;
      },
    }),
    {
      name: 'notes-store',
      storage: createJSONStorage(() => zustandStorage),
      // Only persist the notes data, not loading states or realtime channel
      partialize: (state) => ({
        notes: state.notes,
        initialized: state.initialized,
      }),
      // Rehydrate and initialize realtime after store is loaded
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Initialize realtime subscription after rehydration
          setTimeout(() => {
            state.initializeRealtime();
          }, 100);
        }
      },
    }
  )
);

// Helper hook for easy access to notes operations
export const useNotesActions = () => {
  const actions = useNotesStore((state) => ({
    fetchNotes: state.fetchNotes,
    deleteNote: state.deleteNote,
    updateNoteFavorite: state.updateNoteFavorite,
    refresh: state.refresh,
    initializeRealtime: state.initializeRealtime,
    cleanupRealtime: state.cleanupRealtime,
    // Filtering methods
    getNotesByFolder: state.getNotesByFolder,
    getFavoriteNotes: state.getFavoriteNotes,
    getFilteredNotes: state.getFilteredNotes,
  }));

  return actions;
};

// Helper hook for notes data
export const useNotesData = () => {
  const data = useNotesStore((state) => ({
    notes: state.notes,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
  }));

  return data;
};

// Export commonly used selectors for direct store access
export const getNotes = () => useNotesStore.getState().notes;
export const getNotesLoading = () => useNotesStore.getState().loading;
export const getNotesError = () => useNotesStore.getState().error;

// Initialize the store when the module is imported
// This ensures realtime is set up early
if (typeof window !== 'undefined') {
  // Only initialize in client-side environment
  setTimeout(() => {
    try {
      const store = useNotesStore.getState();
      if (!store.initialized) {
        store.fetchNotes().then(() => {
          store.initializeRealtime();
        });
      } else {
        store.initializeRealtime();
      }
    } catch (error) {
      console.error('Error initializing notes store:', error);
      // If there's an error, it might be due to corrupted storage
      // Clear the storage and try again
      try {
        const { storage } = require('@/lib/storage');
        storage.state.delete('notes-store');
        console.log('Cleared corrupted notes storage');
      } catch (clearError) {
        console.error('Could not clear storage:', clearError);
      }
    }
  }, 600); // Slightly delayed after folders to avoid conflicts
}

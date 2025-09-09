import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { zustandStorage } from '@/lib/storage/zustand';
import type { Folder, CreateFolderInput, UpdateFolderInput } from '@/types/folder';
import type { TablesInsert } from '@/types/database';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface FolderState {
  // State
  folders: Folder[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Realtime subscription
  realtimeChannel: RealtimeChannel | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFolders: (folders: Folder[]) => void;

  // API Actions
  fetchFolders: () => Promise<void>;
  createFolder: (folder: CreateFolderInput, userId?: string) => Promise<Folder | null>;
  updateFolder: (folderId: string, updates: UpdateFolderInput) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;

  // Realtime management
  initializeRealtime: () => void;
  cleanupRealtime: () => void;

  // Utility
  refresh: () => Promise<void>;
  reset: () => void;
}

// Singleton pattern for realtime subscription
let realtimeInitialized = false;

export const useFolderStore = create<FolderState>()(
  persist(
    (set, get) => ({
      // Initial state
      folders: [],
      loading: false,
      error: null,
      initialized: false,
      realtimeChannel: null,

      // State setters
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFolders: (folders) => set({ folders }),

      // Fetch folders from API
      fetchFolders: async () => {
        const state = get();
        if (state.loading) return; // Prevent concurrent requests

        set({ loading: true, error: null });

        try {
          const { data, error: supabaseError } = await supabase
            .from('folders')
            .select('*')
            .order('created_at', { ascending: false });

          if (supabaseError) {
            throw supabaseError;
          }

          if (data) {
            set({
              folders: data as Folder[],
              loading: false,
              initialized: true
            });
          }
        } catch (err: any) {
          console.error('Failed to fetch folders:', err);
          set({
            error: err.message || 'Failed to fetch folders',
            loading: false
          });
        }
      },

      // Create new folder
      createFolder: async (folderInput: CreateFolderInput, userId?: string): Promise<Folder | null> => {
        try {
          set({ error: null });

          const insertData: TablesInsert<'folders'> = {
            user_id: userId,
            title: folderInput.title,
            description: folderInput.description || null
          };

          const { data, error: supabaseError } = await supabase
            .from('folders')
            .insert([insertData])
            .select()
            .single();

          if (supabaseError) {
            throw supabaseError;
          }

          if (data) {
            const newFolder = data as Folder;
            // Optimistically update the store
            const currentFolders = get().folders;
            const folderExists = currentFolders.some(folder => folder.id === newFolder.id);

            if (!folderExists) {
              set({ folders: [newFolder, ...currentFolders] });
            }

            return newFolder;
          }
        } catch (err: any) {
          console.error('Failed to create folder:', err);
          set({ error: err.message || 'Failed to create folder' });
          throw err;
        }

        return null;
      },

      // Update existing folder
      updateFolder: async (folderId: string, updates: UpdateFolderInput) => {
        try {
          set({ error: null });

          const { data, error: supabaseError } = await supabase
            .from('folders')
            .update(updates)
            .eq('id', folderId)
            .select()
            .single();

          if (supabaseError) {
            throw supabaseError;
          }

          if (data) {
            const updatedFolder = data as Folder;
            const currentFolders = get().folders;
            const updatedFolders = currentFolders.map(folder =>
              folder.id === folderId ? updatedFolder : folder
            );
            set({ folders: updatedFolders });
          }
        } catch (err: any) {
          console.error('Failed to update folder:', err);
          set({ error: err.message || 'Failed to update folder' });
          throw err;
        }
      },

      // Delete folder
      deleteFolder: async (folderId: string) => {
        try {
          set({ error: null });

          const { error: supabaseError } = await supabase
            .from('folders')
            .delete()
            .eq('id', folderId);

          if (supabaseError) {
            throw supabaseError;
          }

          // Optimistically update the store
          const currentFolders = get().folders;
          const updatedFolders = currentFolders.filter(folder => folder.id !== folderId);
          set({ folders: updatedFolders });
        } catch (err: any) {
          console.error('Failed to delete folder:', err);
          set({ error: err.message || 'Failed to delete folder' });
          throw err;
        }
      },

      // Initialize realtime subscription (singleton)
      initializeRealtime: () => {
        if (realtimeInitialized) {
          return; // Already initialized
        }

        console.log('Initializing folder realtime subscription...');
        realtimeInitialized = true;

        const channel = supabase
          .channel('public:folders')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'folders' },
            (payload) => {
              console.log('Folder realtime event:', payload.eventType, payload);

              const { eventType, new: newRecord, old: oldRecord } = payload;
              const currentState = get();

              switch (eventType) {
                case 'INSERT':
                  if (newRecord) {
                    const folderExists = currentState.folders.some(
                      folder => folder.id === newRecord.id
                    );
                    if (!folderExists) {
                      set({
                        folders: [newRecord as Folder, ...currentState.folders]
                      });
                    }
                  }
                  break;

                case 'UPDATE':
                  if (newRecord) {
                    const updatedFolders = currentState.folders.map(folder =>
                      folder.id === newRecord.id ? (newRecord as Folder) : folder
                    );
                    set({ folders: updatedFolders });
                  }
                  break;

                case 'DELETE':
                  if (oldRecord) {
                    const filteredFolders = currentState.folders.filter(
                      folder => folder.id !== oldRecord.id
                    );
                    set({ folders: filteredFolders });
                  }
                  break;
              }
            }
          )
          .subscribe((status) => {
            console.log('Folder realtime subscription status:', status);
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to folder changes');
            } else if (status === 'CHANNEL_ERROR') {
              console.error('Error subscribing to folder changes');
              realtimeInitialized = false; // Allow retry
            }
          });

        set({ realtimeChannel: channel });
      },

      // Cleanup realtime subscription
      cleanupRealtime: () => {
        const state = get();
        if (state.realtimeChannel) {
          console.log('Cleaning up folder realtime subscription...');
          supabase.removeChannel(state.realtimeChannel);
          set({ realtimeChannel: null });
          realtimeInitialized = false;
        }
      },

      // Refresh folders
      refresh: async () => {
        await get().fetchFolders();
      },

      // Reset store state
      reset: () => {
        get().cleanupRealtime();
        set({
          folders: [],
          loading: false,
          error: null,
          initialized: false,
          realtimeChannel: null,
        });
        realtimeInitialized = false;
      },
    }),
    {
      name: 'folder-store',
      storage: createJSONStorage(() => zustandStorage),
      // Only persist the folders data, not loading states or realtime channel
      partialize: (state) => ({
        folders: state.folders,
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

// Helper hook for easy access to folder operations
export const useFolderActions = () => {
  const actions = useFolderStore((state) => ({
    fetchFolders: state.fetchFolders,
    createFolder: state.createFolder,
    updateFolder: state.updateFolder,
    deleteFolder: state.deleteFolder,
    refresh: state.refresh,
    initializeRealtime: state.initializeRealtime,
    cleanupRealtime: state.cleanupRealtime,
  }));

  return actions;
};

// Helper hook for folder data
export const useFolderData = () => {
  const data = useFolderStore((state) => ({
    folders: state.folders,
    loading: state.loading,
    error: state.error,
    initialized: state.initialized,
  }));

  return data;
};

// Export commonly used selectors for direct store access
export const getFolders = () => useFolderStore.getState().folders;
export const getFoldersLoading = () => useFolderStore.getState().loading;
export const getFoldersError = () => useFolderStore.getState().error;

// Initialize the store when the module is imported
// This ensures realtime is set up early
if (typeof window !== 'undefined') {
  // Only initialize in client-side environment
  setTimeout(() => {
    try {
      const store = useFolderStore.getState();
      if (!store.initialized) {
        store.fetchFolders().then(() => {
          store.initializeRealtime();
        });
      } else {
        store.initializeRealtime();
      }
    } catch (error) {
      console.error('Error initializing folder store:', error);
      // If there's an error, it might be due to corrupted storage
      // Clear the storage and try again
      try {
        const { storage } = require('@/lib/storage');
        storage.state.delete('folder-store');
        console.log('Cleared corrupted folder storage');
      } catch (clearError) {
        console.error('Could not clear storage:', clearError);
      }
    }
  }, 500);
}

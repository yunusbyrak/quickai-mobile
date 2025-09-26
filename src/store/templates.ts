import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage/zustand';
import type { TemplatesState, TemplatesActions } from '@/types/template';
import {
  getTemplateGroups,
  getTemplates,
  getTemplatesWithGroups,
  getUserTemplates,
  getUserGeneratedTemplates,
} from '@/services/templates.service';

interface TemplatesStore extends TemplatesState, TemplatesActions {}

export const useTemplatesStore = create<TemplatesStore>()(
  persist(
    (set, get) => ({
      // State
      templateGroups: [],
      templates: [],
      userTemplates: [],
      userGeneratedTemplates: {},
      loading: false,
      error: null,

      // Actions
      fetchTemplateGroups: async (language: string) => {
        set({ loading: true, error: null });
        try {
          const templateGroups = await getTemplateGroups(language);
          set({ templateGroups, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch template groups',
            loading: false,
          });
        }
      },

      fetchTemplates: async (language: string, groupId?: string) => {
        set({ loading: true, error: null });
        try {
          const templates = await getTemplates(language, groupId);
          set({ templates, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch templates',
            loading: false,
          });
        }
      },

      fetchUserTemplates: async (userId: string, language: string) => {
        set({ loading: true, error: null });
        try {
          const userTemplates = await getUserTemplates(userId, language);
          set({ userTemplates, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch user templates',
            loading: false,
          });
        }
      },

      fetchUserGeneratedTemplatesByNote: async (userId: string, noteId: string) => {
        set({ loading: true, error: null });
        try {
          const templates = await getUserGeneratedTemplates(userId, noteId);
          set((state) => ({
            userGeneratedTemplates: {
              ...state.userGeneratedTemplates,
              [noteId]: templates,
            },
            loading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : 'Failed to fetch user generated templates',
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      reset: () =>
        set({
          templateGroups: [],
          templates: [],
          userTemplates: [],
          userGeneratedTemplates: {},
          loading: false,
          error: null,
        }),
    }),
    {
      name: 'templates-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        templateGroups: state.templateGroups,
        templates: state.templates,
        userTemplates: state.userTemplates,
        userGeneratedTemplates: state.userGeneratedTemplates,
      }),
    }
  )
);

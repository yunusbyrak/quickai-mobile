import { useCallback } from 'react';
import { useTemplatesStore } from '@/store/templates';
import type { TemplateGroup, Template, UserTemplate, UserGeneratedTemplate } from '@/types/template';

export const useTemplates = () => {
    const {
        templateGroups,
        templates,
        userTemplates,
        userGeneratedTemplates,
        loading,
        error,
        fetchTemplateGroups,
        fetchTemplates,
        fetchUserTemplates,
        fetchUserGeneratedTemplatesByNote,
        clearError,
        reset,
    } = useTemplatesStore();

    const loadTemplateGroups = useCallback(
        async (language: string) => {
            await fetchTemplateGroups(language);
        },
        [fetchTemplateGroups]
    );

    const loadTemplates = useCallback(
        async (language: string, groupId?: string) => {
            await fetchTemplates(language, groupId);
        },
        [fetchTemplates]
    );

    const loadUserTemplates = useCallback(
        async (userId: string, language: string) => {
            await fetchUserTemplates(userId, language);
        },
        [fetchUserTemplates]
    );

    const loadUserGeneratedTemplatesByNote = useCallback(
        async (userId: string, noteId: string) => {
            await fetchUserGeneratedTemplatesByNote(userId, noteId);
        },
        [fetchUserGeneratedTemplatesByNote]
    );

    const getTemplatesByGroup = useCallback(
        (groupId: string): Template[] => {
            return templates.filter(template => template.group_id === groupId);
        },
        [templates]
    );

    const getTemplateById = useCallback(
        (templateId: string): Template | undefined => {
            return templates.find(template => template.id === templateId);
        },
        [templates]
    );

    const getUserTemplateById = useCallback(
        (templateId: string): UserTemplate | undefined => {
            return userTemplates.find(template => template.id === templateId);
        },
        [userTemplates]
    );

    const getUserGeneratedTemplatesByNote = useCallback(
        (noteId: string): UserGeneratedTemplate[] => {
            return userGeneratedTemplates[noteId] || [];
        },
        [userGeneratedTemplates]
    );

    const getUserGeneratedTemplatesByTemplate = useCallback(
        (templateId: string, noteId?: string): UserGeneratedTemplate[] => {
            if (noteId) {
                const noteTemplates = userGeneratedTemplates[noteId] || [];
                return noteTemplates.filter(template => template.template_id === templateId);
            }

            // If no noteId provided, search across all notes
            const allTemplates = Object.values(userGeneratedTemplates).flat();
            return allTemplates.filter(template => template.template_id === templateId);
        },
        [userGeneratedTemplates]
    );

    const getTemplateGroupById = useCallback(
        (groupId: string): TemplateGroup | undefined => {
            return templateGroups.find(group => group.id === groupId);
        },
        [templateGroups]
    );

    return {
        // State
        templateGroups,
        templates,
        userTemplates,
        userGeneratedTemplates,
        loading,
        error,

        // Actions
        loadTemplateGroups,
        loadTemplates,
        loadUserTemplates,
        loadUserGeneratedTemplatesByNote,
        clearError,
        reset,

        // Selectors
        getTemplatesByGroup,
        getTemplateById,
        getUserTemplateById,
        getUserGeneratedTemplatesByTemplate,
        getUserGeneratedTemplatesByNote,
        getTemplateGroupById,
    };
};

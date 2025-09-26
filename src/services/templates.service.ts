import { supabase } from '@/lib/supabase';
import type { TemplateGroup, Template, UserTemplate, UserGeneratedTemplate } from '@/types/template';

export const getTemplateGroups = async (language: string): Promise<TemplateGroup[]> => {
    const { data, error } = await supabase
        .from('templates_group')
        .select('*')
        .eq('language', language)
        .order('name');

    if (error) throw error;
    return data || [];
};

export const getTemplates = async (language: string, groupId?: string): Promise<Template[]> => {
    let query = supabase
        .from('templates')
        .select('*')
        .eq('language', language);

    if (groupId) {
        query = query.eq('group_id', groupId);
    }

    const { data, error } = await query.order('order', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getTemplatesWithGroups = async (language: string): Promise<Template[]> => {
    const { data, error } = await supabase
        .from('templates')
        .select(`
      *,
      templates_group (
        id,
        name,
        icon,
        color,
        slug
      )
    `)
        .eq('language', language)
        .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getUserTemplates = async (userId: string, language: string): Promise<UserTemplate[]> => {
    const { data, error } = await supabase
        .from('user_templates')
        .select('*')
        .eq('user_id', userId)
        .eq('language', language)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const getUserGeneratedTemplates = async (
    userId: string,
    noteId: string
): Promise<UserGeneratedTemplate[]> => {
    const { data, error } = await supabase
        .from('user_generated_templates')
        .select(`
      *,
      templates (
        id,
        name,
        icon,
        color
      )
    `)
        .eq('user_id', userId)
        .eq('note_id', noteId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

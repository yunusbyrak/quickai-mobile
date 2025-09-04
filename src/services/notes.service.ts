import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/types/database";

export const fetchNotes = async (userId: string): Promise<Tables<'notes'>[]> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        throw error;
    }
    return data;
};

export const fetchNotesByFolderId = async (userId: string, folderId: string): Promise<Tables<'notes'>[]> => {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('folder_id', folderId);

    if (error) {
        throw error;
    }
    return data;
};

export const createNote = async (userId: string, note: TablesInsert<'notes'>): Promise<Tables<'notes'>> => {
    const { data, error } = await supabase
        .from('notes')
        .insert(note)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
};

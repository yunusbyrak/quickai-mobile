import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/types/database";

export const toggleFavorite = async (userId: string, noteId: string, favorite: boolean): Promise<boolean> => {
    console.log('toggleFavorite called for userId:', userId, 'noteId:', noteId, 'favorite:', favorite);
    const { data, error } = await supabase
        .from('notes')
        .update({ favorite: favorite })
        .eq('user_id', userId)
        .eq('id', noteId)

    if (error) {
        throw error;
    }
    return true
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


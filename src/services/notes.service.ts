import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/types/database";

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

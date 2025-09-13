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

// Details

export const getYoutubeDetail = async (noteId: string): Promise<Tables<'youtube_summary'>> => {
    const { data, error } = await supabase
        .from('youtube_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();

    if (error) {
        throw error;
    }
    return data;
};

import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/types/database";

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

import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database";

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

export const getAudioDetail = async (noteId: string): Promise<Tables<'audio_summary'>> => {
    const { data, error } = await supabase
        .from('audio_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getImageDetail = async (noteId: string): Promise<Tables<'image_summary'>> => {
    const { data, error } = await supabase
        .from('image_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getPdfDetail = async (noteId: string): Promise<Tables<'pdf_summary'>> => {
    const { data, error } = await supabase
        .from('pdf_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getTextDetail = async (noteId: string): Promise<Tables<'text_summary'>> => {
    const { data, error } = await supabase
        .from('text_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();
    if (error) {
        throw error;
    }
    return data;
};
